import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api, getToken } from '../api/client';

const TasksContext = createContext(null);

export const useTasks = () => {
    const ctx = useContext(TasksContext);
    if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
    return ctx;
};

const LS_KEY = 'neurosync_tasks';

// Seed tasks shown on first run (until the user creates their own / the DB loads).
const SEED = [
    {
        id: 't1', name: 'Follow-up call with TechCorp', description: 'Discuss contract terms and pricing',
        completed: false, dueDate: 'Today', relatedTo: 'TechCorp Industries',
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'high', type: 'priority', icon: 'flag' }, { label: 'call', type: 'category' }], steps: [],
    },
    {
        id: 't2', name: 'Send proposal to Global Solutions', description: 'Include pricing and implementation timeline',
        completed: false, dueDate: 'Tomorrow', relatedTo: 'Global Solutions',
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'high', type: 'priority', icon: 'flag' }, { label: 'email', type: 'category' }], steps: [],
    },
    {
        id: 't3', name: 'Product demo for StartupHub', description: 'Showcase new features and integrations',
        completed: false, dueDate: 'This week', relatedTo: 'StartupHub',
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [{ label: 'medium', type: 'priority', icon: 'flag' }, { label: 'meeting', type: 'category' }], steps: [],
    },
];

function loadLocal() {
    try {
        const raw = localStorage.getItem(LS_KEY);
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
    const steps = [...(t.microSteps || [])]
        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
        .map((s, i) => ({
            id: `dbs_${s.id ?? i}`,
            text: s.heading || '',
            description: s.description || '',
            completed: !!s.isCompleted,
            estMinutes: Number(s.estimatedMinutes) || 0,
        }));
    const due = t.suggestedDeadline ? new Date(t.suggestedDeadline) : null;
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
        assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
        tags: [],
        steps,
    };
}

function toDbPayload(t) {
    return {
        title: t.name || 'Task',
        summary: t.aiSummary || t.description || '',
        progressPercentage: t.completed ? 100 : 0,
        dueDate: t.dueDateISO || null,
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
    const [tasks, setTasks] = useState(() => loadLocal() ?? SEED);
    const loadedDb = useRef(false);
    const syncTimer = useRef(null);

    // 1) Persist locally on every change — this is what makes tasks survive
    //    navigating between pages and reloading the browser.
    useEffect(() => {
        try { localStorage.setItem(LS_KEY, JSON.stringify(tasks)); } catch { /* ignore */ }
    }, [tasks]);

    // 2) On login, pull the user's tasks from the DB (source of truth when the
    //    backend is reachable). Falls back to local data if the call fails.
    useEffect(() => {
        if (loadedDb.current || !getToken()) return;
        loadedDb.current = true;
        api.getMyTasks()
            .then((db) => { if (Array.isArray(db) && db.length) setTasks(db.map(mapDbTask)); })
            .catch(() => { /* backend not reachable yet — keep local copy */ });
    }, []);

    // 3) Best-effort DB sync for tasks already linked to a DB row (dbId).
    //    Debounced so toggles/edits don't spam the API.
    useEffect(() => {
        if (!getToken()) return;
        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => {
            tasks.filter((t) => t.dbId).forEach((t) => {
                api.updateTask(t.dbId, toDbPayload(t)).catch(() => { /* ignore */ });
            });
        }, 1200);
        return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
    }, [tasks]);

    return (
        <TasksContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TasksContext.Provider>
    );
}
