import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api, getToken } from '../api/client';

const TasksContext = createContext(null);

export const useTasks = () => {
    const ctx = useContext(TasksContext);
    if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
    return ctx;
};

const LS_TASKS = 'neurosync_tasks';
const LS_PROJECTS = 'neurosync_projects';

// Seed tasks shown on first run (until the user creates their own / the DB loads).
const SEED = [
    {
        id: 't1', name: 'Follow-up call with TechCorp', description: 'Discuss contract terms and pricing',
        completed: false, dueDate: 'Today', relatedTo: 'TechCorp Industries', projectId: null,
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'high', type: 'priority', icon: 'flag' }, { label: 'call', type: 'category' }], steps: [],
    },
    {
        id: 't2', name: 'Send proposal to Global Solutions', description: 'Include pricing and implementation timeline',
        completed: false, dueDate: 'Tomorrow', relatedTo: 'Global Solutions', projectId: null,
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'high', type: 'priority', icon: 'flag' }, { label: 'email', type: 'category' }], steps: [],
    },
    {
        id: 't3', name: 'Product demo for StartupHub', description: 'Showcase new features and integrations',
        completed: false, dueDate: 'This week', relatedTo: 'StartupHub', projectId: null,
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'medium', type: 'priority', icon: 'flag' }, { label: 'meeting', type: 'category' }], steps: [],
    },
];

function loadLS(key) {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return null;
}

// Format a Date as the value a <input type="datetime-local"> expects.
function toLocalInput(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Map a backend TaskItem into the UI task shape.
function mapDbTask(t) {
    const due = t.suggestedDeadline ? new Date(t.suggestedDeadline) : null;
    const steps = [...(t.microSteps || [])]
        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
        .map((s, i) => ({
            id: `dbs_${s.id ?? i}`,
            text: s.heading || '',
            description: s.description || '',
            completed: !!s.isCompleted,
            estMinutes: Number(s.estimatedMinutes) || 0,
        }));
    return {
        id: `db_${t.id}`,
        dbId: t.id,
        name: t.title || t.originalSourceText || 'Task',
        description: '',
        aiSummary: t.summary || '',
        completed: t.progressPercentage === 100,
        dueDate: due ? due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today',
        dueDateISO: due ? toLocalInput(due) : '',
        relatedTo: 'My tasks',
        projectId: t.projectId ? `db_${t.projectId}` : null,
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [],
        steps,
    };
}

function mapDbProject(p) {
    return { id: `db_${p.id}`, dbId: p.id, name: p.name, color: p.colorHex || '#166534' };
}

function toDbPayload(t, projectDbId) {
    return {
        title: t.name || 'Task',
        summary: t.aiSummary || t.description || '',
        progressPercentage: t.completed ? 100 : 0,
        dueDate: t.dueDateISO || null,
        projectId: projectDbId ?? null,
        steps: (t.steps || []).map((s, i) => ({
            heading: s.text || '',
            description: s.description || '',
            estimatedMinutes: Number(s.estMinutes) || 0,
            orderIndex: i,
            isCompleted: !!s.completed,
        })),
    };
}

export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const local = loadLS(LS_TASKS);
        if (Array.isArray(local)) return local; // returning user on this browser (even if cleared to [])
        // No local copy yet. If logged in, start empty and let the DB load decide —
        // avoids the demo tasks flashing before the user's real tasks arrive.
        if (getToken()) return [];
        if (!localStorage.getItem('neurosync_seeded')) {
            localStorage.setItem('neurosync_seeded', '1');
            return SEED; // demo tasks appear only the very first time
        }
        return [];
    });
    const [projects, setProjects] = useState(() => loadLS(LS_PROJECTS) || []);
    const [currentProjectId, setCurrentProjectId] = useState(null); // null = "All tasks"

    const loadedDb = useRef(false);
    const syncTimer = useRef(null);

    // Persist locally so tasks/projects survive navigation + reload.
    useEffect(() => { try { localStorage.setItem(LS_TASKS, JSON.stringify(tasks)); } catch { /* ignore */ } }, [tasks]);
    useEffect(() => { try { localStorage.setItem(LS_PROJECTS, JSON.stringify(projects)); } catch { /* ignore */ } }, [projects]);

    // On login, pull the user's projects + tasks from the DB (when reachable).
    useEffect(() => {
        if (loadedDb.current || !getToken()) return;
        loadedDb.current = true;
        api.getProjects().then((db) => { if (Array.isArray(db)) setProjects(db.map(mapDbProject)); }).catch(() => {});
        api.getMyTasks().then((db) => {
            if (Array.isArray(db) && db.length) {
                setTasks(db.map(mapDbTask));
            } else if (Array.isArray(db) && db.length === 0 && !localStorage.getItem('neurosync_seeded')) {
                // Brand-new account with an empty DB → show the demo tasks once.
                localStorage.setItem('neurosync_seeded', '1');
                setTasks(SEED);
            }
        }).catch(() => {});
    }, []);

    // Best-effort debounced DB sync for tasks already linked to a DB row.
    useEffect(() => {
        if (!getToken()) return;
        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => {
            tasks.filter((t) => t.dbId).forEach((t) => {
                const projectDbId = projects.find((p) => p.id === t.projectId)?.dbId ?? null;
                api.updateTask(t.dbId, toDbPayload(t, projectDbId)).catch(() => {});
            });
        }, 1200);
        return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
    }, [tasks, projects]);

    const removeTask = (id) => {
        setTasks((prev) => {
            const t = prev.find((x) => x.id === id);
            if (t?.dbId) api.deleteTask(t.dbId).catch(() => {});
            return prev.filter((x) => x.id !== id);
        });
    };

    // --- Projects CRUD ---
    const addProject = (name, color = '#166534') => {
        const id = `p_${Date.now()}`;
        const project = { id, dbId: null, name, color };
        setProjects((prev) => [...prev, project]);
        api.createProject(name, color)
            .then((saved) => { if (saved?.id) setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, dbId: saved.id } : p))); })
            .catch(() => {});
        return project;
    };

    const renameProject = (id, name) => {
        const p = projects.find((x) => x.id === id);
        setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, name } : x)));
        if (p?.dbId) api.updateProject(p.dbId, { name }).catch(() => {});
    };

    const deleteProject = (id) => {
        const p = projects.find((x) => x.id === id);
        if (p?.dbId) api.deleteProject(p.dbId).catch(() => {});
        setProjects((prev) => prev.filter((x) => x.id !== id));
        // Keep the tasks — just unassign them from the deleted project.
        setTasks((prev) => prev.map((t) => (t.projectId === id ? { ...t, projectId: null } : t)));
        setCurrentProjectId((cur) => (cur === id ? null : cur));
    };

    // Add a task returned by the server (e.g. "Convert all to tasks") to the top.
    const importTaskFromServer = (serverTask) => {
        if (serverTask) setTasks((prev) => [mapDbTask(serverTask), ...prev]);
    };

    return (
        <TasksContext.Provider value={{
            tasks, setTasks, removeTask, importTaskFromServer,
            projects, addProject, renameProject, deleteProject,
            currentProjectId, setCurrentProjectId,
        }}>
            {children}
        </TasksContext.Provider>
    );
}
