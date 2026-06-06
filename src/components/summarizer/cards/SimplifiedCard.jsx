import React from 'react';

export default function SimplifiedCard({ simplifyMode, data }) {
    const hasData = data && String(data).trim().length > 0;

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

            {!hasData ? (
                <p className="text-[14px] text-[var(--color-text-muted)] italic">Not available.</p>
            ) : (
                <div className={`text-[var(--color-text-secondary)] text-[15px] whitespace-pre-wrap ${simplifyMode ? 'leading-loose' : 'leading-relaxed'}`}>
                    {data}
                </div>
            )}
        </div>
    );
}
