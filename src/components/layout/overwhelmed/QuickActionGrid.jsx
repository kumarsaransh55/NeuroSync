import React from 'react';

export default function QuickActionGrid({ onAction }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
                onClick={() => onAction('breathe')}
                className="w-full text-left bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[#ECFDF5] hover:border-[#22C55E] hover:text-[#166534] transition-colors group"
            >
                <span className="inline-block w-6 text-center group-hover:scale-110 transition-transform">🧘</span>
                Start 30-second breathing exercise
            </button>
            <button
                onClick={() => onAction('task')}
                className="w-full text-left bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[#ECFDF5] hover:border-[#22C55E] hover:text-[#166534] transition-colors group"
            >
                <span className="inline-block w-6 text-center group-hover:scale-110 transition-transform">📋</span>
                Show only the next task
            </button>
            <button
                onClick={() => onAction('focus')}
                className="w-full text-left bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[#ECFDF5] hover:border-[#22C55E] hover:text-[#166534] transition-colors group"
            >
                <span className="inline-block w-6 text-center group-hover:scale-110 transition-transform">🔇</span>
                Enable focus mode
            </button>
            <button
                onClick={() => onAction('timer')}
                className="w-full text-left bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 text-[14px] font-medium text-[var(--color-text-primary)] hover:bg-[#ECFDF5] hover:border-[#22C55E] hover:text-[#166534] transition-colors group"
            >
                <span className="inline-block w-6 text-center group-hover:scale-110 transition-transform">⏱</span>
                Start 5-minute reset timer
            </button>
        </div>
    );
}
