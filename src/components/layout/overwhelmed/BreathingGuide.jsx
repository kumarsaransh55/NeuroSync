import React from 'react';

export default function BreathingGuide() {
    return (
        <div className="bg-[#F0FDF4] border-l-4 border-[#22C55E] p-4 rounded-r-xl mb-6">
            <h4 className="font-semibold text-[15px] text-[var(--color-text-primary)] mb-3">
                Try this breathing exercise
            </h4>
            <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
                    <span className="font-medium text-[var(--color-text-primary)] w-6 h-6 rounded-full bg-white border border-[#22C55E] flex items-center justify-center text-[12px]">1</span>
                    Breathe in for 4 seconds
                </li>
                <li className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
                    <span className="font-medium text-[var(--color-text-primary)] w-6 h-6 rounded-full bg-white border border-[#22C55E] flex items-center justify-center text-[12px]">2</span>
                    Hold your breath for 4 seconds
                </li>
                <li className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
                    <span className="font-medium text-[var(--color-text-primary)] w-6 h-6 rounded-full bg-white border border-[#22C55E] flex items-center justify-center text-[12px]">3</span>
                    Slowly breathe out for 6 seconds
                </li>
            </ul>
            <p className="text-[13px] text-[var(--color-brand-start)] font-medium">
                Repeat this cycle three times.
            </p>
        </div>
    );
}
