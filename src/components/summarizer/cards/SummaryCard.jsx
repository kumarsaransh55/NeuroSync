import React, { useState } from 'react';
import { Copy, Clock, Check } from 'lucide-react';

export default function SummaryCard({ data }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">AI Summary</h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-[13px] font-medium text-[var(--color-text-secondary)] border border-gray-100">
                        <Clock size={14} className="text-gray-400" />
                        2 min read
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-[13px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border-color)] hover:bg-gray-50 transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={14} className="text-[var(--color-accent)]" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            <p className="text-[var(--color-text-secondary)] leading-relaxed text-[15px]">
                {data}
            </p>
        </div>
    );
}
