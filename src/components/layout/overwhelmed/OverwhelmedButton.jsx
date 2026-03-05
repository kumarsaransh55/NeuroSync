import React from 'react';

export default function OverwhelmedButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#166534] border border-[#22C55E] px-4 py-2.5 rounded-[12px] font-medium text-[14px] hover:-translate-y-[1px] hover:bg-[#DCFCE7] hover:shadow-[0_0_0_3px_rgba(34,197,94,0.15)] transition-all duration-200"
            aria-label="Feeling overwhelmed? Reset your focus"
        >
            <span className="text-[16px] leading-none">⚡</span>
            Feeling Overwhelmed?
        </button>
    );
}
