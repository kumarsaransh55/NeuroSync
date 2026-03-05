import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ToneCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Tone Analysis</h3>

            <div className="flex items-center gap-3">
                <div className="bg-[#FEE2E2] text-[#991B1B] px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 w-fit border border-[#FCA5A5]">
                    <AlertCircle size={14} strokeWidth={2.5} />
                    Urgent
                </div>
                <span className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Primary sentiment</span>
            </div>

            <p className="text-[13px] text-[var(--color-text-secondary)] mt-4 leading-relaxed">
                The sender emphasizes tight deadlines and uses strong directive language regarding budget confirmation.
            </p>
        </div>
    );
}
