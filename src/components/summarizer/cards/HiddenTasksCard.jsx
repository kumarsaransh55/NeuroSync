import React from 'react';
import { EyeOff } from 'lucide-react';

export default function HiddenTasksCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Hidden Tasks</h3>
                <EyeOff size={16} className="text-[var(--color-text-muted)]" />
            </div>

            <ul className="space-y-4">
                <li className="flex flex-col gap-1.5 border-b border-[var(--color-border-color)] pb-3 last:border-0 last:pb-0">
                    <span className="text-[12px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">"Let me know your feedback"</span>
                    <div className="flex items-center gap-2 text-[14px] text-[var(--color-text-primary)] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></div>
                        Provide feedback
                    </div>
                </li>
                <li className="flex flex-col gap-1.5 pb-2">
                    <span className="text-[12px] text-[var(--color-text-muted)] font-medium uppercase tracking-wider">"Keep marketing in the loop"</span>
                    <div className="flex items-center gap-2 text-[14px] text-[var(--color-text-primary)] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></div>
                        Update marketing team
                    </div>
                </li>
            </ul>
        </div>
    );
}
