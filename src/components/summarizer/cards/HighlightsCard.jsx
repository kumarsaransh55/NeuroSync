import React from 'react';

export default function HighlightsCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Important Points</h3>

            <div className="space-y-4">
                <div className="bg-[#F0FDF4] border-l-4 border-[var(--color-accent)] p-4 rounded-r-xl shadow-sm">
                    <p className="text-[14px] text-[var(--color-brand-start)] font-medium italic">
                        "The new Tailwind CSS design system must be strictly adhered to; do not introduce competing frameworks."
                    </p>
                </div>

                <div className="bg-[#F0FDF4] border-l-4 border-[var(--color-accent)] p-4 rounded-r-xl shadow-sm">
                    <p className="text-[14px] text-[var(--color-brand-start)] font-medium italic">
                        "Budget allocations are currently estimates and require formal sign-off before Friday."
                    </p>
                </div>
            </div>
        </div>
    );
}
