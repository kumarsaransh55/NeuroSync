import React from 'react';
import { EyeOff } from 'lucide-react';

export default function HiddenTasksCard({ data = [] }) {
    const hasData = Array.isArray(data) && data.length > 0;

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Hidden Tasks</h3>
                <EyeOff size={16} className="text-[var(--color-text-muted)]" />
            </div>

            {!hasData ? (
                <p className="text-[14px] text-[var(--color-text-muted)] italic">No hidden tasks detected.</p>
            ) : (
                <ul className="space-y-4">
                    {data.map((item) => (
                        <li key={item.id} className="flex flex-col gap-1.5 border-b border-[var(--color-border-color)] pb-3 last:border-0 last:pb-0">
                            {item.context && (
                                <span className="text-[12px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">{item.context}</span>
                            )}
                            <div className="flex items-center gap-2 text-[14px] text-[var(--color-text-primary)] font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0"></div>
                                {item.text}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
