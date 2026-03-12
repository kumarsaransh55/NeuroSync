import React, { useState } from 'react';
import {
    Sparkles, Mail, GripVertical, CheckCircle2, Circle,
    Clock, Calendar, Bell, ShieldAlert, Play, Target, Plus,
    MoreVertical, ChevronDown, Inbox, Star, History, Trash, Briefcase, User
} from 'lucide-react';
import GmailInboxModal from './GmailInboxModal';

export default function TaskBuilder() {
    // 1. Task Details State
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    // 1.5 Modal State
    const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);

    // 2. Micro-Steps State
    const [steps, setSteps] = useState([
        { id: '1', text: 'Analyze requirements', completed: true, estMinutes: 15 },
        { id: '2', text: 'Draft initial wireframes', completed: false, estMinutes: 45 },
        { id: '3', text: 'Review with team', completed: false, estMinutes: 30 },
    ]);
    const [draggedStepId, setDraggedStepId] = useState(null);

    // 3. Timeline & Scheduling State
    const [dueDate, setDueDate] = useState('');

    // 4. Reminder State
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [reminderType, setReminderType] = useState('Standard'); // Gentle, Standard, Persistent
    const [reminderFreq, setReminderFreq] = useState('10 mins before');
    const [escalate, setEscalate] = useState(false);

    // 5. Focus Mode State
    const [focusMode, setFocusMode] = useState(false);

    // --- Actions ---

    // Handle bringing an email from the modal context into the task builder
    const handleAddEmailAsTask = (email) => {
        setTaskName(`[Email] ${email.subject}`);
        setTaskDesc(`From: ${email.sender}\n\n${email.body}`);

        // Auto-generate some AI steps from the email
        setSteps([
            { id: Date.now().toString(), text: `Review email from ${email.sender}`, completed: false, estMinutes: 10 },
            { id: (Date.now() + 1).toString(), text: 'Formulate response points', completed: false, estMinutes: 15 },
            { id: (Date.now() + 2).toString(), text: 'Draft reply', completed: false, estMinutes: 20 },
            { id: (Date.now() + 3).toString(), text: 'Send and archive', completed: false, estMinutes: 5 },
        ]);

        setIsGmailModalOpen(false);
    };

    const handleAIBreakdown = () => {
        if (!taskName) return;
        // Simulate AI generating steps
        setSteps([
            { id: Date.now().toString(), text: `Research: ${taskName}`, completed: false, estMinutes: 20 },
            { id: (Date.now() + 1).toString(), text: 'Outline main concepts', completed: false, estMinutes: 30 },
            { id: (Date.now() + 2).toString(), text: 'Draft actual content', completed: false, estMinutes: 60 },
            { id: (Date.now() + 3).toString(), text: 'Review and refine', completed: false, estMinutes: 15 },
        ]);
    };

    const handleStepToggle = (id) => {
        setSteps(steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
    };

    const handleStepTextChange = (id, newText) => {
        setSteps(steps.map(s => s.id === id ? { ...s, text: newText } : s));
    };

    const handleStepTimeChange = (id, newTime) => {
        const time = parseInt(newTime) || 0;
        setSteps(steps.map(s => s.id === id ? { ...s, estMinutes: time } : s));
    };

    // Simple Drag & Drop Reordering
    const handleDragStart = (e, id) => {
        setDraggedStepId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Hide standard HTML5 drag image for a cleaner look if desired, but native is okay
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (!draggedStepId) return;

        const draggedIndex = steps.findIndex(s => s.id === draggedStepId);
        if (draggedIndex === index) return;

        const newSteps = [...steps];
        const [removed] = newSteps.splice(draggedIndex, 1);
        newSteps.splice(index, 0, removed);
        setSteps(newSteps);
    };

    const handleDragEnd = () => {
        setDraggedStepId(null);
    };

    // Computations
    const totalEstMinutes = steps.reduce((acc, step) => acc + step.estMinutes, 0);
    const completedStepsCount = steps.filter(s => s.completed).length;
    const progressPercent = steps.length > 0 ? Math.round((completedStepsCount / steps.length) * 100) : 0;

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

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20 px-4 sm:px-6">
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
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">6</span>
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

                        <div className="mb-4">
                            <h4 className="flex items-center gap-2 text-[14px] font-bold text-gray-900 mb-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Work
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-blue-600 bg-blue-50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-blue-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-2 border-blue-600 flex items-center justify-center">
                                            <div className="w-[6px] h-[6px] rounded-full bg-blue-600"></div>
                                        </div>
                                        <span>Design & Development</span>
                                    </div>
                                </li>
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-black flex items-center justify-center"></div>
                                        <span>Progress Check-in</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-[14px] font-bold text-gray-900 mb-2 mt-6">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Personal
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-black flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span>Shopping</span>
                                    </div>
                                </li>
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-black flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                        </div>
                                        <span>Traveling</span>
                                    </div>
                                </li>
                                <li className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3 text-[14px] font-medium text-gray-700">
                                        <div className="w-[18px] h-[18px] rounded-full border-[2px] border-black flex items-center justify-center"></div>
                                        <span>Sport</span>
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
                                    className="w-full text-xl font-bold border-none outline-none placeholder:text-gray-300 focus:ring-0 px-0 text-[var(--color-text-primary)]"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                            </div>
                            <div>
                                <textarea
                                    className="w-full min-h-[100px] text-[15px] resize-none border-none outline-none placeholder:text-gray-400 focus:ring-0 px-0 text-[var(--color-text-secondary)] leading-relaxed"
                                    placeholder="Task description (optional)..."
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-border-color)]">
                                <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm flex items-center gap-2">
                                    <Plus size={16} />
                                    Create Task
                                </button>
                                <button
                                    onClick={handleAIBreakdown}
                                    className="px-4 py-2.5 rounded-[var(--radius-btn)] bg-purple-50 text-purple-600 font-medium text-[14px] hover:bg-purple-100 transition-colors flex items-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    AI Break Into Steps
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. AI Micro-Step Breakdown Section */}
                    <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--color-border-color)]">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                                <Target size={18} className="text-[var(--color-brand-start)]" />
                                Action Steps
                            </h3>
                            <button className="text-[13px] text-[var(--color-brand-start)] font-medium hover:underline flex items-center gap-1">
                                <Plus size={14} /> Add Step
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-[12px] font-medium mb-1">
                                <span className={progressPercent === 100 ? 'text-green-600' : 'text-[var(--color-text-secondary)]'}>
                                    {progressPercent}% Completed
                                </span>
                                <span className="text-[var(--color-text-muted)]">{completedStepsCount} of {steps.length}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${progressPercent === 100 ? 'bg-green-500' : 'bg-[var(--color-brand-start)]'}`}
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Parent Context Header (If applicable) */}
                        {taskName && (
                            <div className="mb-4 p-3 bg-[var(--color-bg-light)] border border-gray-200 rounded-xl flex items-start gap-3">
                                <div className="mt-0.5">
                                    {progressPercent === 100 ? (
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    ) : (
                                        <Circle size={18} className="text-[var(--color-brand-start)]" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-bold text-[var(--color-text-primary)]">{taskName}</h4>
                                    {taskDesc && <p className="text-[12px] text-gray-500 line-clamp-2 mt-0.5">{taskDesc}</p>}
                                </div>
                            </div>
                        )}

                        {/* Checklist */}
                        <div className="space-y-2 relative pl-2">
                            {/* Connector line if parent exists */}
                            {taskName && steps.length > 0 && (
                                <div className="absolute left-4 top-0 bottom-6 w-px bg-gray-200 -z-10"></div>
                            )}

                            {steps.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                    No steps yet. Use AI to generate steps or add manually.
                                </div>
                            )}

                            {steps.map((step, index) => {
                                const isCurrentFocus = focusMode && !step.completed && steps.findIndex(s => !s.completed) === index;
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
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing relative
                                            ${taskName ? 'ml-6' : ''}
                                            ${step.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-gray-300'}
                                            ${isCurrentFocus ? 'ring-2 ring-[var(--color-brand-start)] ring-offset-2 border-transparent scale-[1.01] shadow-md bg-blue-50/30' : ''}
                                            ${draggedStepId === step.id ? 'opacity-50' : 'opacity-100'}
                                        `}
                                    >
                                        {/* Connector branch if parent exists */}
                                        {taskName && (
                                            <div className="absolute -left-6 top-1/2 w-4 h-px bg-gray-200"></div>
                                        )}

                                        {/* Drag Handle */}
                                        <div className="text-gray-300 hover:text-gray-500 transition-colors">
                                            <GripVertical size={16} />
                                        </div>

                                        {/* Checkbox */}
                                        <button
                                            onClick={() => handleStepToggle(step.id)}
                                            className="flex-shrink-0 focus:outline-none"
                                        >
                                            {step.completed ? (
                                                <CheckCircle2 size={20} className="text-green-500" />
                                            ) : (
                                                <Circle size={20} className="text-gray-300 hover:text-[var(--color-brand-start)] transition-colors" />
                                            )}
                                        </button>

                                        {/* Step Text (Inline Editable) */}
                                        <input
                                            type="text"
                                            value={step.text}
                                            onChange={(e) => handleStepTextChange(step.id, e.target.value)}
                                            className={`flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-[14px] font-medium
                                                ${step.completed ? 'text-gray-400 line-through' : 'text-[var(--color-text-primary)]'}
                                            `}
                                        />

                                        {/* Estimated Time (Inline Editable) */}
                                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Clock size={12} className="text-gray-400" />
                                            <input
                                                type="number"
                                                value={step.estMinutes}
                                                onChange={(e) => handleStepTimeChange(step.id, e.target.value)}
                                                className="w-10 bg-transparent text-right border-none outline-none focus:ring-1 focus:ring-gray-200 rounded p-0 text-[12px] text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-[12px] text-gray-500">m</span>
                                        </div>
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
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full text-[13px] border border-gray-200 rounded-lg pl-3 pr-3 py-2 outline-none focus:border-[var(--color-brand-start)] focus:ring-1 focus:ring-[var(--color-brand-start)] transition-colors"
                                    />
                                </div>
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

                        </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <GmailInboxModal
                isOpen={isGmailModalOpen}
                onClose={() => setIsGmailModalOpen(false)}
                onAddTask={handleAddEmailAsTask}
            />
        </div>
    );
}
