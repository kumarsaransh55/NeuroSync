import React, { useState, useEffect, useCallback } from 'react';
import { useFocus } from '../../context/FocusContext';
import { useTasks } from '../../context/TasksContext';
import { useSettings } from '../../context/SettingsContext';
import { X, Pause, Play, Check, Sparkles, PartyPopper } from 'lucide-react';

// A calm, full-screen focus session. Everything fades away except the ONE step
// you're on, with a gentle countdown. This is the "understanding → doing" moment:
// the app doesn't just explain the work, it walks you through it one step at a time.

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function FocusSession() {
    const { focusMode, focusTaskId, stopFocus } = useFocus();
    const { tasks, setTasks } = useTasks();
    const { settings } = useSettings();

    // Resolve the task: the explicitly chosen one, else the first active task.
    const task = (focusTaskId && tasks.find((t) => t.id === focusTaskId))
        || tasks.find((t) => !t.completed)
        || null;

    const steps = task?.steps || [];
    const hasSteps = steps.length > 0;
    const incomplete = steps.filter((s) => !s.completed);

    // The single thing in focus right now: the first incomplete step, or — for a
    // task with no steps — the task itself as one item.
    const current = hasSteps
        ? (incomplete[0] || null)
        : (task && !task.completed
            ? { id: `task_${task.id}`, text: task.name, description: task.aiSummary || task.description || '', estMinutes: settings?.timerLength || 25, _isTask: true }
            : null);

    const totalItems = hasSteps ? steps.length : 1;
    const doneItems = hasSteps ? steps.length - incomplete.length : 0;

    const defaultMin = settings?.timerLength || 25;
    const itemMinutes = current && current.estMinutes > 0 ? current.estMinutes : defaultMin;

    const [secondsLeft, setSecondsLeft] = useState(itemMinutes * 60);
    const [paused, setPaused] = useState(false);

    const currentId = current?.id;

    // Reset the countdown whenever the focused item changes.
    useEffect(() => {
        setSecondsLeft(itemMinutes * 60);
        setPaused(false);
    }, [currentId, itemMinutes]);

    // Tick once per second while focused and not paused.
    useEffect(() => {
        if (!focusMode || !currentId || paused) return;
        const iv = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(iv);
    }, [focusMode, currentId, paused]);

    // Escape closes the session.
    const active = focusMode && !!task;
    useEffect(() => {
        if (!active) return;
        const onKey = (e) => { if (e.key === 'Escape') stopFocus(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [active, stopFocus]);

    const completeCurrent = useCallback(() => {
        if (!task || !current) return;
        if (current._isTask) {
            setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)));
        } else {
            setTasks((prev) => prev.map((t) => {
                if (t.id !== task.id) return t;
                const steps = t.steps.map((s) => (s.id === current.id ? { ...s, completed: true } : s));
                // When the last subtask is done, mark the whole task complete too
                // (so its heading strikes off and it leaves the "next step" slot).
                const allDone = steps.length > 0 && steps.every((s) => s.completed);
                return { ...t, steps, completed: allDone ? true : t.completed };
            }));
        }
    }, [task, current, setTasks]);

    if (!active) return null;

    const elapsed = itemMinutes * 60 - secondsLeft;
    const ringPct = itemMinutes > 0 ? Math.min(100, (elapsed / (itemMinutes * 60)) * 100) : 0;
    const radius = 90;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (ringPct / 100) * circ;
    const allDone = !current;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--color-brand-start)]/85 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-[var(--color-card-bg)] rounded-[24px] shadow-2xl p-8 sm:p-10 text-center">
                {/* Exit */}
                <button
                    onClick={stopFocus}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-label="Exit focus mode"
                >
                    <X size={20} />
                </button>

                {allDone ? (
                    <div className="py-8">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-success-bg)] text-[var(--color-brand-end)] flex items-center justify-center mb-5">
                            <PartyPopper size={30} />
                        </div>
                        <h2 className="text-[24px] font-bold text-[var(--color-text-primary)]">All done</h2>
                        <p className="text-[14px] text-[var(--color-text-secondary)] mt-2 max-w-xs mx-auto">
                            You worked through &ldquo;{task.name}&rdquo; one step at a time. That&rsquo;s real momentum.
                        </p>
                        <button
                            onClick={stopFocus}
                            className="mt-6 px-6 py-3 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-mid)] transition-colors"
                        >
                            Finish
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)] mb-1">
                            <Sparkles size={14} className="text-[var(--color-brand-start)]" /> Focus
                            {hasSteps && <span>· step {Math.min(doneItems + 1, totalItems)} of {totalItems}</span>}
                        </div>

                        {/* Countdown ring */}
                        <div className="relative flex items-center justify-center my-6">
                            <svg className="w-[210px] h-[210px] -rotate-90 transform" viewBox="0 0 210 210">
                                <circle cx="105" cy="105" r={radius} fill="none" stroke="var(--color-border-color)" strokeWidth="10" />
                                <circle
                                    cx="105" cy="105" r={radius}
                                    fill="none"
                                    stroke="var(--color-brand-start)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circ}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-linear"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-[44px] font-bold text-[var(--color-text-primary)] leading-none tabular-nums">{fmt(secondsLeft)}</span>
                                <span className="text-[12px] font-medium text-[var(--color-text-muted)] mt-1">{paused ? 'paused' : 'remaining'}</span>
                            </div>
                        </div>

                        {/* The single step */}
                        <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--color-text-primary)] leading-snug px-2">
                            {current.text}
                        </h2>
                        {current.description && (
                            <p className="text-[14px] text-[var(--color-text-secondary)] mt-2 leading-relaxed max-w-md mx-auto">
                                {current.description}
                            </p>
                        )}

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-3 mt-7">
                            <button
                                onClick={() => setPaused((p) => !p)}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius-btn)] border border-[var(--color-border-color)] text-[var(--color-text-primary)] font-medium text-[14px] hover:bg-[var(--color-bg-light)] transition-colors"
                            >
                                {paused ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
                            </button>
                            <button
                                onClick={completeCurrent}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm"
                            >
                                <Check size={16} /> Done &amp; next
                            </button>
                        </div>

                        <p className="text-[12px] text-[var(--color-text-muted)] mt-6 truncate">{task.name}</p>
                    </>
                )}
            </div>
        </div>
    );
}
