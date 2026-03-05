import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const initialTasks = [
    { id: 1, text: "Deploy initial dashboard by August 15th", checked: false },
    { id: 2, text: "Incorporate new Tailwind CSS design system", checked: false },
    { id: 3, text: "Ensure layout components are fully responsive", checked: false },
    { id: 4, text: "Confirm revised budget with finance team", checked: false },
];

export default function ActionItemsCard() {
    const [tasks, setTasks] = useState(initialTasks);

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
    };

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Key Action Items</h3>
                <span className="bg-[#ECFDF5] text-[var(--color-brand-end)] text-xs font-bold px-2.5 py-1 rounded-full">{tasks.length} found</span>
            </div>

            <ul className="space-y-3 mb-5">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-start gap-3 group">
                        <div className="relative flex items-start pt-0.5">
                            <input
                                type="checkbox"
                                id={`task-${task.id}`}
                                checked={task.checked}
                                onChange={() => toggleTask(task.id)}
                                className="w-[18px] h-[18px] rounded border-2 border-[var(--color-border-color)] appearance-none checked:bg-[var(--color-accent)] checked:border-[var(--color-accent)] cursor-pointer transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-accent)]"
                            />
                            {task.checked && (
                                <svg className="absolute top-[3px] left-[3px] w-3 h-3 text-white pointer-events-none" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="11.6666 3.5 5.24992 9.91667 2.33325 7"></polyline>
                                </svg>
                            )}
                        </div>
                        <label
                            htmlFor={`task-${task.id}`}
                            className={`text-[15px] cursor-pointer block select-none transition-colors ${task.checked ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]'}`}
                        >
                            {task.text}
                        </label>
                    </li>
                ))}
            </ul>

            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--color-border-color)] bg-gray-50 text-[14px] font-medium text-[var(--color-text-secondary)] hover:bg-white hover:border-[var(--color-accent)] hover:text-[var(--color-brand-end)] transition-all">
                <Plus size={16} />
                Convert All to Tasks
            </button>
        </div>
    );
}
