import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TasksContext';
import { useFocus } from '../../context/FocusContext';
import { ArrowRight, CheckCircle2, ListChecks, Clock, Sparkles, Sprout, FolderKanban } from 'lucide-react';

// A calm, inclusion-first overview. Everything here is driven by the user's
// REAL tasks/steps (no mock metrics) and follows the product's "one thing at a
// time" principle: the single next action is the hero, the rest stays quiet.

const isToday = (d) => typeof d === 'string' && /today/i.test(d);

function StatTile({ icon: Icon, label, value }) {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-5 border border-[var(--color-border-color)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[13px] font-medium mb-3">
                <span className="w-7 h-7 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-brand-start)] flex items-center justify-center">
                    <Icon size={15} />
                </span>
                {label}
            </div>
            <div className="text-[26px] font-bold text-[var(--color-text-primary)] leading-none">{value}</div>
        </div>
    );
}

export default function DashboardHome() {
    const navigate = useNavigate();
    const { tasks, projects } = useTasks();
    const { startFocus } = useFocus();

    // A task counts as done if it's flagged complete OR every subtask is checked,
    // so a fully-worked task never lingers as the "next step".
    const isDone = (t) => t.completed || ((t.steps?.length > 0) && t.steps.every((s) => s.completed));
    const active = tasks.filter((t) => !isDone(t));
    const completed = tasks.filter(isDone);
    const allSteps = tasks.flatMap((t) => t.steps || []);
    const doneSteps = allSteps.filter((s) => s.completed);
    const stepPct = allSteps.length
        ? Math.round((doneSteps.length / allSteps.length) * 100)
        : (tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0);

    const todays = active.filter((t) => isToday(t.dueDate));
    const minutesPlanned = active
        .flatMap((t) => t.steps || [])
        .filter((s) => !s.completed)
        .reduce((sum, s) => sum + (Number(s.estMinutes) || 0), 0);

    // One thing at a time: surface a single next action.
    const nextTask = todays[0] || active[0] || null;
    const nextStep = nextTask?.steps?.find((s) => !s.completed) || null;

    const planList = [...todays, ...active.filter((t) => !isToday(t.dueDate))].slice(0, 6);

    const startNext = () => {
        if (nextTask) {
            startFocus(nextTask.id);
        } else {
            navigate('/dashboard/tasks');
        }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // Momentum ring geometry.
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (stepPct / 100) * circ;

    return (
        <div className="space-y-6">
            <p className="text-[14px] text-[var(--color-text-secondary)]">
                {greeting}. Here&rsquo;s a calm place to start &mdash; just the next thing.
            </p>

            {/* Hero: the single next step */}
            <div className="rounded-[var(--radius-card)] p-6 sm:p-8 bg-gradient-to-br from-[var(--color-brand-start)] via-[var(--color-brand-mid)] to-[var(--color-brand-end)] text-white shadow-[var(--shadow-card)]">
                {nextTask ? (
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-white/70 text-[13px] font-medium mb-3">
                                <Sparkles size={15} /> Your next step
                            </div>
                            <h2 className="text-[24px] sm:text-[28px] font-bold leading-snug">
                                {nextStep ? nextStep.text : nextTask.name}
                            </h2>
                            {nextStep ? (
                                <p className="text-white/75 text-[14px] mt-2">
                                    in &ldquo;{nextTask.name}&rdquo;
                                    {nextStep.estMinutes ? ` · about ${nextStep.estMinutes} min` : ''}
                                </p>
                            ) : (
                                nextTask.aiSummary && (
                                    <p className="text-white/75 text-[14px] mt-2 line-clamp-2">{nextTask.aiSummary}</p>
                                )
                            )}
                        </div>
                        <button
                            onClick={startNext}
                            className="shrink-0 inline-flex items-center gap-2 bg-white text-[var(--color-brand-start)] font-semibold text-[14px] px-5 py-3 rounded-[var(--radius-btn)] hover:bg-white/90 transition-colors shadow-sm"
                        >
                            Start in Focus Mode <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <h2 className="text-[22px] font-bold">You&rsquo;re all caught up</h2>
                                <p className="text-white/75 text-[14px] mt-1">Nothing waiting on you right now. Nice work.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/summarizer')}
                            className="shrink-0 inline-flex items-center gap-2 bg-white text-[var(--color-brand-start)] font-semibold text-[14px] px-5 py-3 rounded-[var(--radius-btn)] hover:bg-white/90 transition-colors shadow-sm"
                        >
                            Summarize an email <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Quiet, real stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatTile icon={ListChecks} label="Active tasks" value={active.length} />
                <StatTile icon={CheckCircle2} label="Completed" value={completed.length} />
                <StatTile icon={Sparkles} label="Steps cleared" value={`${doneSteps.length}/${allSteps.length}`} />
                <StatTile icon={Clock} label="Minutes to focus" value={minutesPlanned} />
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Today's plan */}
                <div className="col-span-12 lg:col-span-8 bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 border border-[var(--color-border-color)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Today&rsquo;s plan</h3>
                        <button
                            onClick={() => navigate('/dashboard/tasks')}
                            className="text-[13px] text-[var(--color-brand-start)] font-medium hover:underline flex items-center gap-1"
                        >
                            All tasks <ArrowRight size={14} />
                        </button>
                    </div>

                    {planList.length > 0 ? (
                        <div className="space-y-2">
                            {planList.map((t) => {
                                const ts = t.steps || [];
                                const done = ts.filter((s) => s.completed).length;
                                const pct = ts.length ? Math.round((done / ts.length) * 100) : (t.completed ? 100 : 0);
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => navigate('/dashboard/tasks')}
                                        className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-bg-light)] transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-brand-start)]">
                                                    {t.name}
                                                </span>
                                                {isToday(t.dueDate) && (
                                                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success-text)]">
                                                        Today
                                                    </span>
                                                )}
                                            </div>
                                            {ts.length > 0 && (
                                                <div className="mt-2 h-1.5 rounded-full bg-[var(--color-border-color)] overflow-hidden">
                                                    <div className="h-full bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${pct}%` }} />
                                                </div>
                                            )}
                                            <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                                                {ts.length > 0 ? `${done}/${ts.length} steps · ${t.dueDate}` : t.dueDate}
                                            </p>
                                        </div>
                                        <ArrowRight size={16} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-[var(--color-text-muted)]">
                            <p className="text-[14px]">No active tasks. Paste an email in the Summarizer to get started.</p>
                        </div>
                    )}
                </div>

                {/* Momentum */}
                <div className="col-span-12 lg:col-span-4 bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 border border-[var(--color-border-color)] shadow-sm flex flex-col items-center">
                    <h3 className="self-start text-[16px] font-semibold text-[var(--color-text-primary)] mb-2">Momentum</h3>
                    <div className="relative flex items-center justify-center flex-1 my-4">
                        <svg className="w-[150px] h-[150px] -rotate-90 transform" viewBox="0 0 140 140">
                            <defs>
                                <linearGradient id="momentumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--color-brand-start)" />
                                    <stop offset="100%" stopColor="var(--color-accent)" />
                                </linearGradient>
                            </defs>
                            <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-border-color)" strokeWidth="14" />
                            <circle
                                cx="70" cy="70" r={radius}
                                fill="none"
                                stroke="url(#momentumGradient)"
                                strokeWidth="14"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                strokeDashoffset={offset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-[30px] font-bold text-[var(--color-text-primary)] leading-none">{stepPct}%</span>
                            <span className="text-[11px] font-medium text-[var(--color-text-secondary)] mt-1">done</span>
                        </div>
                    </div>
                    <p className="text-center text-[13px] text-[var(--color-text-secondary)]">
                        {allSteps.length > 0
                            ? `${doneSteps.length} of ${allSteps.length} steps cleared`
                            : `${completed.length} of ${tasks.length} tasks done`}
                    </p>
                    {projects.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--color-border-color)] w-full flex items-center justify-center gap-2 text-[13px] text-[var(--color-text-muted)]">
                            <FolderKanban size={14} /> {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
