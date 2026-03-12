import React from 'react';
import { Calendar } from 'lucide-react';

export default function DeadlineCard({ data = [] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Detected Deadlines</h3>

            <div className="grid gap-3 sm:grid-cols-2">
                {data.map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-3 p-4 bg-[#F0FDF4] rounded-xl border border-[#DCFCE7] shadow-sm">
                        <div className="mt-0.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={16} className="text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <p className="font-bold text-[var(--color-brand-start)] text-[14px]">
                                {deadline.date}
                            </p>
                            <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
                                {deadline.task}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
