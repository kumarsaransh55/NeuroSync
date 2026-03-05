import React from 'react';

export default function SimplifiedCard({ simplifyMode }) {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Simplified Language</h3>
                {simplifyMode && (
                    <span className="bg-[var(--color-brand-start)] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Active
                    </span>
                )}
            </div>

            <div className={`text-[var(--color-text-secondary)] text-[15px] ${simplifyMode ? 'leading-loose space-y-4' : 'leading-relaxed space-y-2'}`}>
                <p>
                    Here is what we need to do for the Q3 project:
                </p>
                <ul className={`list-disc pl-5 ${simplifyMode ? 'space-y-4' : 'space-y-1'}`}>
                    <li>Launch the first version of the dashboard by August 15th.</li>
                    <li>Use the new Tailwind CSS designs.</li>
                    <li>Make sure the website works on phones and tablets before building reports.</li>
                    <li>Get approval from the finance team for the budget before the meeting on Friday.</li>
                </ul>
            </div>
        </div>
    );
}
