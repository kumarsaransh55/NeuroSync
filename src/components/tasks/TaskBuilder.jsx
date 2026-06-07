import React, { useState, useEffect } from 'react';
import {
    Sparkles, Mail, GripVertical, CheckCircle2, Circle,
    Clock, Calendar, Bell, ShieldAlert, Play, Target, Plus,
    MoreVertical, ChevronDown, Inbox, Star, History, Trash, Briefcase, User
} from 'lucide-react';
import OutlookInboxModal from './OutlookInboxModal';
import { api } from '../../api/client';
import { useFocus } from '../../context/FocusContext';
import { useTasks } from '../../context/TasksContext';
import { scheduleReminder, ensureNotificationPermission } from '../../lib/reminders';

export default function TaskBuilder() {
    // 1. Task Details State
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    // 1.5 Modal State
    const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);

    // 2. Tasks State
    const { tasks, setTasks } = useTasks();

    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [draggedStepId, setDraggedStepId] = useState(null);
    const [aiLoading, setAiLoading] = useState(null); // taskId or 'draft'

    // 3. Timeline & Scheduling State
    const [dueDate, setDueDate] = useState('');

    // 4. Reminder State
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [reminderType, setReminderType] = useState('Standard');
    const [reminderFreq, setReminderFreq] = useState('10 mins before');
    const [escalate, setEscalate] = useState(false);
    const [reminderMsg, setReminderMsg] = useState('');

    // 5. Focus Mode State (shared globally so the "Feeling overwhelmed" actions can trigger it)
    const { focusMode, setFocusMode } = useFocus();

    // If the Summarizer sent action items here ("Convert all to tasks"), add them.
    useEffect(() => {
        const raw = localStorage.getItem('neurosync_pending_tasks');
        if (!raw) return;
        localStorage.removeItem('neurosync_pending_tasks');
        let texts = [];
        try { texts = JSON.parse(raw) || []; } catch { texts = []; }
        if (!texts.length) return;
        const incoming = texts.map((text, i) => ({
            id: `pending_${Date.now()}_${i}`,
            name: text,
            description: '',
            completed: false,
            dueDate: 'Today',
            relatedTo: 'From Summarizer',
            assignee: { name: 'Me', avatar: `https://ui-avatars.com/api/?name=Me&background=random` },
            tags: [{ label: 'email', type: 'category' }],
            steps: [],
        }));
        setTasks(prev => [...incoming, ...prev]);
        // Persist each to the DB (best-effort) and link the dbId so future edits sync.
        incoming.forEach(async (task) => {
            try {
                const saved = await api.quickCreateTask(task.name, '');
                if (saved?.id) setTasks(prev => prev.map(t => t.id === task.id ? { ...t, dbId: saved.id } : t));
            } catch { /* backend not reachable — kept locally */ }
        });
    }, []);

    // --- Actions ---

    // Turn an Outlook email into a task, then let the AI break it into micro-steps.
    const handleAddEmailAsTask = async (email) => {
        setIsGmailModalOpen(false);

        const tempId = Date.now().toString();
        const rawText = `${email.subject}\n\nFrom: ${email.sender}\n\n${email.body}`;

        const placeholder = {
            id: tempId,
            name: email.subject,
            description: `From: ${email.sender}`,
            completed: false,
            dueDate: 'Today',
            relatedTo: email.sender,
            assignee: { name: 'Me', avatar: `https://ui-avatars.com/api/?name=Me&background=random` },
            tags: [{ label: 'email', type: 'category' }],
            steps: [],
        };
        setTasks(prev => [placeholder, ...prev]);
        setExpandedTaskId(tempId);
        setAiLoading(tempId);

        try {
            const data = await api.createTask(rawText);
            const steps = mapMicroSteps(data.microSteps);
            setTasks(prev => prev.map(t =>
                t.id === tempId
                    ? { ...t, dbId: data.id ?? t.dbId, name: data.title || t.name, aiSummary: data.summary || '', aiError: null, steps }
                    : t
            ));
        } catch (err) {
            setTasks(prev => prev.map(t => t.id === tempId ? { ...t, aiError: err.message } : t));
        } finally {
            setAiLoading(null);
        }
    };

    const handleCreateTask = async () => {
        if (!taskName.trim()) return;
        const tempId = Date.now().toString();
        const nm = taskName, ds = taskDesc;
        const newTask = {
            id: tempId,
            name: nm,
            description: ds,
            completed: false,
            dueDate: 'Today',
            relatedTo: 'General',
            assignee: { name: 'Me', avatar: `https://ui-avatars.com/api/?name=Me&background=random` },
            tags: [],
            steps: []
        };
        setTasks(prev => [newTask, ...prev]);
        setTaskName('');
        setTaskDesc('');
        // Best-effort: persist to the DB so it survives across devices/logins.
        try {
            const saved = await api.quickCreateTask(nm, ds);
            if (saved?.id) setTasks(prev => prev.map(t => t.id === tempId ? { ...t, dbId: saved.id } : t));
        } catch { /* backend not reachable — kept locally */ }
    }


    // Map the backend TaskItem.microSteps into the UI's step shape.
    const mapMicroSteps = (microSteps = []) =>
        [...microSteps]
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
            .map((s, i) => ({
                id: `${s.id ?? 'step'}-${i}`,
                text: s.heading || '',
                description: s.description || '',
                completed: !!s.isCompleted,
                estMinutes: Number(s.estimatedMinutes) || 0,
            }));

    // "AI Break Into Steps" from the create box: makes a real call to the
    // backend, which uses Gemini to break the text into micro-steps.
    const handleAIBreakdownDraft = async () => {
        if (!taskName.trim()) return;

        const tempId = Date.now().toString();
        const rawText = taskDesc.trim() ? `${taskName}\n\n${taskDesc}` : taskName;

        // Show the card immediately with a loading state, then fill it in.
        const placeholder = {
            id: tempId,
            name: taskName,
            description: taskDesc,
            completed: false,
            dueDate: 'Today',
            relatedTo: 'General',
            assignee: { name: 'Me', avatar: `https://ui-avatars.com/api/?name=Me&background=random` },
            tags: [],
            steps: [],
        };
        setTasks(prev => [placeholder, ...prev]);
        setExpandedTaskId(tempId);
        setTaskName('');
        setTaskDesc('');
        setAiLoading(tempId);

        try {
            const data = await api.createTask(rawText);
            const steps = mapMicroSteps(data.microSteps);
            setTasks(prev => prev.map(t =>
                t.id === tempId
                    ? { ...t, dbId: data.id ?? t.dbId, name: data.title || t.name, aiSummary: data.summary || '', aiError: null, steps }
                    : t
            ));
        } catch (err) {
            setTasks(prev => prev.map(t => t.id === tempId ? { ...t, aiError: err.message } : t));
        } finally {
            setAiLoading(null);
        }
    };

    // "AI Break Into Steps" on an existing task card.
    const handleAIBreakdown = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const rawText = task.description?.trim() ? `${task.name}\n\n${task.description}` : task.name;
        setAiLoading(taskId);

        try {
            if (task.dbId) {
                // Already saved — break down only, then the debounced sync updates the SAME row (no duplicate).
                const data = await api.breakdownTask(rawText);
                const steps = mapMicroSteps(data.steps);
                setTasks(prev => prev.map(t =>
                    t.id === taskId ? { ...t, aiSummary: data.taskSummary || t.aiSummary, aiError: null, steps } : t
                ));
            } else {
                // Not yet persisted — create + persist with its steps.
                const data = await api.createTask(rawText);
                const steps = mapMicroSteps(data.microSteps);
                setTasks(prev => prev.map(t =>
                    t.id === taskId ? { ...t, dbId: data.id ?? t.dbId, aiSummary: data.summary || t.aiSummary, aiError: null, steps } : t
                ));
            }
        } catch (err) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, aiError: err.message } : t));
        } finally {
            setAiLoading(null);
        }
    };

    const handleTaskToggle = (taskId) => {
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, completed: !t.completed };
            }
            return t;
        }));
    }

    const handleStepToggle = (taskId, stepId) => {
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s) };
            }
            return t;
        }));
    };

    const handleStepTextChange = (taskId, stepId, newText) => {
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, text: newText } : s) };
            }
            return t;
        }));
    };

    const handleStepTimeChange = (taskId, stepId, newTime) => {
        const time = parseInt(newTime) || 0;
        setTasks(tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, steps: t.steps.map(s => s.id === stepId ? { ...s, estMinutes: time } : s) };
            }
            return t;
        }));
    };

    // Simple Drag & Drop Reordering (for subtasks of the expanded task)
    const handleDragStart = (e, id) => {
        setDraggedStepId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index, taskId) => {
        e.preventDefault();
        if (!draggedStepId) return;

        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const draggedIndex = task.steps.findIndex(s => s.id === draggedStepId);
        if (draggedIndex === index) return;

        const newSteps = [...task.steps];
        const [removed] = newSteps.splice(draggedIndex, 1);
        newSteps.splice(index, 0, removed);
        
        setTasks(tasks.map(t => t.id === taskId ? { ...t, steps: newSteps } : t));
    };

    const handleDragEnd = () => {
        setDraggedStepId(null);
    };

    // Due date is per-task: it applies to the currently open task and is saved to the DB.
    const handleDueDateChange = (value) => {
        setDueDate(value);
        if (!expandedTaskId) return;
        const display = value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today';
        setTasks(prev => prev.map(t => t.id === expandedTaskId ? { ...t, dueDateISO: value, dueDate: display } : t));
    };

    // Computations
    const activeTask = tasks.find(t => t.id === expandedTaskId);
    const totalEstMinutes = activeTask ? activeTask.steps.reduce((acc, step) => acc + step.estMinutes, 0) : 0;

    // Format minutes to hrs/mins
    const formatTime = (mins) => {
        if (mins < 60) return `${mins}m`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    // Reminder Type Visuals
    const reminderColors = {
        Gentle: 'bg-blue-50 text-blue-600 border-blue-200',
        Standard: 'bg-brand-50 text-brand-600 border-brand-200',
        Persistent: 'bg-red-50 text-red-600 border-red-200',
    };

    // Schedule a real browser notification (works while the tab is open).
    // A production build would use a service worker / server push instead.
    const handleSetReminder = async () => {
        // Best-effort OS permission; the in-app toast fires regardless.
        const perm = await ensureNotificationPermission();

        const offsets = { 'At time of due date': 0, '10 mins before': 10, '30 mins before': 30, '1 hour before': 60, '1 day before': 1440 };
        const at = tasks.find(t => t.id === expandedTaskId);
        const dueIso = at?.dueDateISO || dueDate;
        let fireAt;
        if (dueIso) {
            fireAt = new Date(dueIso).getTime() - (offsets[reminderFreq] ?? 0) * 60000;
        } else {
            fireAt = Date.now() + 10000; // no due date set → gentle demo nudge in ~10s
        }
        let delay = fireAt - Date.now();
        if (delay < 0) delay = 1000; // time already passed → nudge shortly so it isn't lost

        scheduleReminder({
            delayMs: delay,
            message: 'Gentle nudge — a little progress on your task is enough 🌿',
            style: reminderType,
        });

        const future = (fireAt - Date.now()) > 0;
        const whenText = (dueIso && future) ? new Date(fireAt).toLocaleString() : `in about ${Math.round(delay / 1000)} seconds`;
        const permNote = perm === 'granted' ? '' : ' — shown in-app (allow notifications for system alerts too)';
        setReminderMsg(`Reminder set — a ${reminderType.toLowerCase()} nudge will arrive ${whenText}${permNote}.`);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}


            <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transition-all duration-500 ${focusMode ? 'scale-[1.02] transform' : ''}`}>

                {/* Left Sidebar Section (Matching the Image) */}
                <div className="lg:col-span-1 hidden lg:block space-y-4">
                    <div className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)] border border-[var(--color-border-color)]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[15px] text-gray-900">Overview</h3>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Plus size={16} className="cursor-pointer hover:text-gray-800" />
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6">
                            <li
                                onClick={() => setIsGmailModalOpen(true)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                    <Inbox size={18} className="text-gray-600" />
                                    <span>Inbox</span>
                                </div>
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">6</span>
                            </li>
                            <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                    <Star size={18} className="text-amber-500 fill-amber-500" />
                                    <span>Today</span>
                                </div>
                            </li>
                            <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                    <Calendar size={18} className="text-gray-600" />
                                    <span>Upcoming</span>
                                </div>
                                {tasks.length > 3 && (
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{tasks.length - 3}</span>
                                )}
                            </li>
                            <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                    <History size={18} className="text-gray-600" />
                                    <span>History</span>
                                </div>
                            </li>
                            <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                    <Trash size={18} className="text-gray-600" />
                                    <span>Trash</span>
                                </div>
                            </li>
                        </ul>

                        <div>
                            <h4 className="flex items-center gap-2 text-[14px] font-bold text-gray-900 mb-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Projects
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-blue-600 bg-blue-50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-blue-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-2 border-blue-600 flex items-center justify-center">
                                            <div className="w-[6px] h-[6px] rounded-full bg-blue-600"></div>
                                        </div>
                                        <span>TechCorp account</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Center Column (Existing content shifted) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Create Task Section */}
                    <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--color-border-color)]">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter task name..."
                                    className="w-full text-xl font-bold bg-gray-50 rounded-lg px-3 py-2 border border-transparent outline-none placeholder:text-gray-300 focus:border-[var(--color-brand-start)] focus:ring-2 focus:ring-[var(--color-brand-start)]/20 text-[var(--color-text-primary)] transition-colors"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                            </div>
                            <div>
                                <textarea
                                    className="w-full min-h-[90px] text-[15px] resize-none bg-gray-50 rounded-lg px-3 py-2 border border-transparent outline-none placeholder:text-gray-400 focus:border-[var(--color-brand-start)] focus:ring-2 focus:ring-[var(--color-brand-start)]/20 text-[var(--color-text-secondary)] leading-relaxed transition-colors"
                                    placeholder="Task description (optional)..."
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-border-color)]">
                                <button
                                    onClick={handleCreateTask}
                                    className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Create Task
                                </button>
                                <button
                                    onClick={handleAIBreakdownDraft}
                                    disabled={aiLoading === 'draft'}
                                    className="px-4 py-2.5 rounded-[var(--radius-btn)] bg-purple-50 text-purple-600 font-medium text-[14px] hover:bg-purple-100 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                                >
                                    {aiLoading === 'draft' ? (
                                        <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" /></svg>
                                    ) : (
                                        <Sparkles size={16} />
                                    )}
                                    {aiLoading === 'draft' ? 'Generating...' : 'AI Break Into Steps'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Tasks List / Action Steps */}
                    <div>
                        <div className="flex justify-between items-end mb-4 px-2">
                            <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <Target size={18} className="text-[var(--color-brand-start)]" />
                                Action Steps
                            </h3>
                        </div>

                        {/* List of Tasks */}
                        <div className="space-y-4">
                            {tasks.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                    No tasks yet. Create one above.
                                </div>
                            )}

                            {tasks.map((task) => {
                                const isExpanded = expandedTaskId === task.id;
                                const completedStepsCount = task.steps.filter(s => s.completed).length;
                                const progressPercent = task.steps.length > 0 ? Math.round((completedStepsCount / task.steps.length) * 100) : 0;

                                return (
                                    <div key={task.id} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] transition-all duration-200 hover:shadow-md overflow-hidden">
                                        {/* Task Overview / Header */}
                                        <div 
                                            className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50/50' : 'bg-white'}`}
                                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTaskToggle(task.id);
                                                }}
                                                className="flex-shrink-0 focus:outline-none mt-1 transition-transform active:scale-95"
                                            >
                                                {task.completed ? (
                                                    <div className="w-[18px] h-[18px] rounded flex items-center justify-center bg-amber-400">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-[18px] h-[18px] rounded border-2 border-gray-300 hover:border-gray-400 transition-colors bg-white"></div>
                                                )}
                                            </button>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-[16px] font-semibold tracking-tight ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                                    {task.name}
                                                </h3>
                                                {task.description && (
                                                    <p className={`text-[13px] mt-1 line-clamp-2 ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Meta Row: Date, Related, Assignee */}
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {task.dueDate}
                                                    </div>
                                                    {task.relatedTo && (
                                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-amber-600">
                                                            <span className="text-gray-400">Related to:</span> {task.relatedTo}
                                                        </div>
                                                    )}
                                                    {task.assignee && (
                                                        <div className="flex items-center gap-2">
                                                            <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                                                            <span className="text-[12px] font-bold text-gray-900">{task.assignee.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tags/Badges */}
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 mt-1">
                                                {task.tags.map((tag, idx) => {
                                                    let tagClasses = "px-2 tracking-wide py-0.5 rounded text-[11px] font-bold flex items-center gap-1 capitalize whitespace-nowrap ";
                                                    let icon = null;
                                                    
                                                    if (tag.type === 'priority') {
                                                        if (tag.label === 'high') tagClasses += "bg-red-50 text-red-500";
                                                        else if (tag.label === 'medium') tagClasses += "bg-amber-50 text-amber-500";
                                                        else tagClasses += "bg-green-50 text-green-500";
                                                        
                                                        if (tag.icon === 'flag') {
                                                            icon = (
                                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                                                    <line x1="4" y1="22" x2="4" y2="15"></line>
                                                                </svg>
                                                            );
                                                        }
                                                    } else if (tag.type === 'category') {
                                                         if (tag.label === 'call') tagClasses += "bg-green-100 text-green-600";
                                                         else if (tag.label === 'email') tagClasses += "bg-blue-100 text-blue-600";
                                                         else if (tag.label === 'meeting') tagClasses += "bg-purple-100 text-purple-600";
                                                         else tagClasses += "bg-yellow-100 text-yellow-700";
                                                    }
                                                    return (
                                                        <span key={`${task.id}-tag-${idx}`} className={tagClasses}>
                                                            {icon}{tag.label}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Expanded Subtasks Area */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-100 bg-white p-5 cursor-default">
                                                <div className="flex justify-between items-end mb-4">
                                                    <div>
                                                        <h4 className="text-[14px] font-bold text-gray-900">Subtasks</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-1.5 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-green-500' : 'bg-[var(--color-brand-start)]'}`}
                                                                    style={{ width: `${progressPercent}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-[11px] font-medium text-gray-500">{progressPercent}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAIBreakdown(task.id)}
                                                            disabled={aiLoading === task.id}
                                                            className="px-3 py-1.5 rounded bg-purple-50 text-purple-600 font-medium text-[12px] hover:bg-purple-100 transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
                                                        >
                                                            {aiLoading === task.id ? (
                                                                <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" /></svg>
                                                            ) : (
                                                                <Sparkles size={14} />
                                                            )}
                                                            {aiLoading === task.id ? 'Generating...' : 'AI Break Into Steps'}
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                const newStep = { id: Date.now().toString(), text: '', completed: false, estMinutes: 10 };
                                                                setTasks(tasks.map(t => t.id === task.id ? { ...t, steps: [...t.steps, newStep] } : t));
                                                            }}
                                                            className="text-[12px] text-[var(--color-brand-start)] font-medium hover:underline flex items-center gap-1 p-1.5"
                                                        >
                                                            <Plus size={14} /> Add Step
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {/* AI Summary Banner */}
                                                    {task.aiSummary && (
                                                        <div className="mb-3 p-3 rounded-lg bg-purple-50 border border-purple-100 flex gap-2">
                                                            <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                                            <p className="text-[12px] text-purple-700 leading-relaxed">{task.aiSummary}</p>
                                                        </div>
                                                    )}
                                                    {/* AI Error Banner */}
                                                    {task.aiError && (
                                                        <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-100 flex gap-2">
                                                            <ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                                            <p className="text-[12px] text-red-600 leading-relaxed">{task.aiError}</p>
                                                        </div>
                                                    )}
                                                    {/* Loading Skeleton */}
                                                    {aiLoading === task.id && (
                                                        <div className="space-y-2 animate-pulse">
                                                            {[1,2,3].map(i => (
                                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                                                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                                                                    <div className="flex-1 h-3 rounded bg-gray-200" />
                                                                    <div className="w-10 h-3 rounded bg-gray-200" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {task.steps.length === 0 && aiLoading !== task.id && (
                                                        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                                            No steps yet. Use AI to generate steps or add manually.
                                                        </div>
                                                    )}

                                                    {task.steps.map((step, index) => {
                                                        const isCurrentFocus = focusMode && !step.completed && task.steps.findIndex(s => !s.completed) === index;
                                                        const isCollapsed = focusMode && !isCurrentFocus && !step.completed;

                                                        if (isCollapsed) {
                                                            return (
                                                                <div key={step.id} className="py-2 px-4 rounded-lg bg-gray-50 flex items-center justify-between text-gray-400 opacity-50 scale-95 origin-left transition-all duration-300 ml-6">
                                                                    <span className="text-sm truncate">{step.text}</span>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <div
                                                                key={step.id}
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, step.id)}
                                                                onDragOver={(e) => handleDragOver(e, index, task.id)}
                                                                onDragEnd={handleDragEnd}
                                                                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing relative
                                                                    ${step.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-gray-300'}
                                                                    ${isCurrentFocus ? 'ring-2 ring-[var(--color-brand-start)] ring-offset-2 border-transparent scale-[1.01] shadow-md bg-blue-50/30' : ''}
                                                                    ${draggedStepId === step.id ? 'opacity-50' : 'opacity-100'}
                                                                `}
                                                            >
                                                                {/* Checkbox */}
                                                                <button
                                                                    onClick={() => handleStepToggle(task.id, step.id)}
                                                                    className="flex-shrink-0 focus:outline-none ml-2"
                                                                >
                                                                    {step.completed ? (
                                                                        <CheckCircle2 size={18} className="text-green-500" />
                                                                    ) : (
                                                                        <Circle size={18} className="text-gray-300 hover:text-[var(--color-brand-start)] transition-colors" />
                                                                    )}
                                                                </button>

                                                                {/* Step Text (Inline Editable) + AI Description */}
                                                                <div className="flex-1 min-w-0">
                                                                    <input
                                                                        type="text"
                                                                        value={step.text}
                                                                        placeholder="Type step task..."
                                                                        onChange={(e) => handleStepTextChange(task.id, step.id, e.target.value)}
                                                                        className={`w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-[13px] font-medium
                                                                            ${step.completed ? 'text-gray-400 line-through' : 'text-gray-700'}
                                                                        `}
                                                                    />
                                                                    {step.description && (
                                                                        <p className={`text-[11px] mt-0.5 leading-relaxed ${step.completed ? 'text-gray-300' : 'text-gray-400'}`}>
                                                                            {step.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Estimated Time (Inline Editable) */}
                                                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                                    <Clock size={12} className="text-gray-400" />
                                                                    <input
                                                                        type="number"
                                                                        value={step.estMinutes}
                                                                        onChange={(e) => handleStepTimeChange(task.id, step.id, e.target.value)}
                                                                        className="w-10 bg-transparent text-right border-none outline-none focus:ring-0 rounded p-0 text-[12px] text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                    />
                                                                    <span className="text-[12px] text-gray-500 mr-2">m</span>
                                                                </div>

                                                                {/* Delete Step */}
                                                                <button 
                                                                    onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, steps: t.steps.filter(s => s.id !== step.id) } : t))}
                                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                                >
                                                                    <Trash size={14} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">

                    {/* 5. Start Task Button (Focus Mode) */}
                    <div className="bg-white rounded-[var(--radius-card)] p-1 shadow-[var(--shadow-card)] overflow-hidden">
                        <button
                            onClick={() => setFocusMode(!focusMode)}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-[16px] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                                ${focusMode
                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-[var(--color-brand-start)] text-white hover:bg-[var(--color-brand-mid)]'
                                }
                            `}
                        >
                            {focusMode ? (
                                <>
                                    <Circle size={20} className="fill-current opacity-20" />
                                    Exit Focus Mode
                                </>
                            ) : (
                                <>
                                    <Play size={20} className="fill-current" />
                                    Start Task
                                </>
                            )}
                        </button>
                    </div>

                    {/* 3. Timeline & Scheduling */}
                    <div className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] border border-[var(--color-border-color)]">
                        <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" /> Timeline
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-500 uppercase">Total Estimate</p>
                                        <p className="font-bold text-[15px]">{formatTime(totalEstMinutes)}</p>
                                    </div>
                                </div>
                                <Sparkles size={14} className="text-purple-400" />
                            </div>

                            <div>
                                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Due Date</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={activeTask ? (activeTask.dueDateISO || '') : dueDate}
                                        onChange={(e) => handleDueDateChange(e.target.value)}
                                        className="w-full text-[13px] border border-gray-200 rounded-lg pl-3 pr-3 py-2 outline-none focus:border-[var(--color-brand-start)] focus:ring-1 focus:ring-[var(--color-brand-start)] transition-colors"
                                    />
                                </div>
                                {!expandedTaskId && (
                                    <p className="text-[11px] text-gray-400 mt-1">Open a task to set its due date.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Adaptive Reminder Settings */}
                    <div className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] border border-[var(--color-border-color)]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
                                <Bell size={16} className="text-gray-400" /> Reminders
                            </h3>
                            {/* Toggle Switch */}
                            <button
                                onClick={() => setRemindersEnabled(!remindersEnabled)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${remindersEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${remindersEnabled ? 'left-[22px]' : 'left-0.5'}`}></div>
                            </button>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 ${remindersEnabled ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>

                            <div>
                                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Reminder Style</label>
                                <div className="relative">
                                    <select
                                        value={reminderType}
                                        onChange={(e) => setReminderType(e.target.value)}
                                        className="w-full text-[13px] border border-gray-200 rounded-lg pl-3 pr-8 py-2 outline-none focus:border-[var(--color-brand-start)] appearance-none bg-white font-medium"
                                    >
                                        <option value="Gentle">Gentle (Silent notification)</option>
                                        <option value="Standard">Standard (Push + Sound)</option>
                                        <option value="Persistent">Persistent (Requires dismissal)</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Visual Preview */}
                            <div className={`p-3 rounded-lg border text-[12px] font-medium flex items-center gap-2 ${reminderColors[reminderType.split(' ')[0]] || reminderColors.Standard}`}>
                                {reminderType.includes('Persistent') ? <ShieldAlert size={14} /> : <Bell size={14} />}
                                Preview: {reminderType.split(' ')[0]} Notification
                            </div>

                            <div>
                                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Frequency</label>
                                <select
                                    value={reminderFreq}
                                    onChange={(e) => setReminderFreq(e.target.value)}
                                    className="w-full text-[13px] border border-gray-200 rounded-lg pl-3 py-2 outline-none focus:border-[var(--color-brand-start)] bg-white"
                                >
                                    <option>At time of due date</option>
                                    <option>10 mins before</option>
                                    <option>30 mins before</option>
                                    <option>1 hour before</option>
                                    <option>1 day before</option>
                                </select>
                            </div>

                            <label className="flex items-start gap-2 cursor-pointer mt-2 group">
                                <div className="relative flex items-center justify-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={escalate}
                                        onChange={(e) => setEscalate(e.target.checked)}
                                        className="appearance-none w-4 h-4 border border-gray-300 rounded checked:bg-[var(--color-brand-start)] checked:border-[var(--color-brand-start)] transition-colors"
                                    />
                                    {escalate && <CheckCircle2 size={12} className="absolute text-white pointer-events-none" strokeWidth={3} />}
                                </div>
                                <div>
                                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Escalate if ignored</span>
                                    <p className="text-[11px] text-gray-400">If unread for 30m, switch to persistent.</p>
                                </div>
                            </label>

                            <button
                                onClick={handleSetReminder}
                                className="w-full py-2.5 rounded-lg bg-[var(--color-brand-start)] text-white text-[13px] font-medium hover:bg-[var(--color-brand-mid)] transition-colors flex items-center justify-center gap-2"
                            >
                                <Bell size={14} /> Set reminder
                            </button>
                            {reminderMsg && (
                                <p className="text-[11px] text-[var(--color-brand-end)] bg-[var(--color-success-bg)] rounded-lg p-2 leading-relaxed">{reminderMsg}</p>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <OutlookInboxModal
                isOpen={isGmailModalOpen}
                onClose={() => setIsGmailModalOpen(false)}
                onAddTask={handleAddEmailAsTask}
            />
        </div>
    );
}
