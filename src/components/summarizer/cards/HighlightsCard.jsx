import React from 'react';

export default function HighlightsCard({ data = [] }) {
    const hasData = Array.isArray(data) && data.length > 0;

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Important Points</h3>

            {!hasData ? (
                <p className="text-[14px] text-[var(--color-text-muted)] italic">No key points detected.</p>
            ) : (
                <div className="space-y-3">
                    {data.map((point, i) => (
                        <div key={i} className="bg-[#F0FDF4] border-l-4 border-[var(--color-accent)] p-4 rounded-r-xl shadow-sm">
                            <p className="text-[14px] text-[var(--color-brand-start)] font-medium">{point}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
