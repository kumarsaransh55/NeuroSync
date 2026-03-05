import React from 'react';
import UploadZone from './UploadZone';

export default function InputWorkspace() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Input Content</h2>

            {/* Main Textarea */}
            <div className="mb-6">
                <textarea
                    className="w-full h-[280px] p-4 border border-[var(--color-border-color)] rounded-[var(--radius-btn)] resize-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-[14px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="Paste your email or document here..."
                ></textarea>
            </div>

            {/* File Upload Zone */}
            <div className="mb-6">
                <UploadZone />
            </div>

            {/* AI Control Buttons */}
            <div className="flex flex-wrap items-center gap-3">
                <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-gradient-to-r from-[#14532D] to-[#166534] text-white font-medium text-[14px] hover:shadow-md transition-all">
                    Generate Summary
                </button>
                <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-white border border-[var(--color-accent)] text-[var(--color-brand-end)] font-medium text-[14px] hover:bg-[#ECFDF5] transition-colors">
                    Simplify Language
                </button>
                <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-white border border-[var(--color-accent)] text-[var(--color-brand-end)] font-medium text-[14px] hover:bg-[#ECFDF5] transition-colors">
                    Extract Tasks
                </button>
            </div>
        </div>
    );
}
