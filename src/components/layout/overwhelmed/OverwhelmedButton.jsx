import React from 'react';

export default function OverwhelmedButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-row items-center gap-2.5 bg-gradient-to-r from-[#EEF2FD] via-white to-[#F9E8F3]
            px-3 py-1.5 rounded-[14px] shadow-[0_4px_16px_rgba(31,35,70,0.06)] border border-white/80
            hover:shadow-[0_6px_20px_rgba(31,35,70,0.08)] hover:-translate-y-0.5 transition-all duration-300
            text-left relative active:scale-[0.98] outline-none"
            aria-label="Feeling overwhelmed? Reset your focus"
        >
            {/* Soft inner glow */}
            <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"></div>

            {/* Illustration SVG representation */}
            <div className="shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 relative z-10 transition-transform duration-300 group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                    {/* Confused swirls */}
                    <path d="M 18 30 Q 12 20 25 15 M 10 40 Q 5 25 22 30" stroke="#1F2445" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Floating eye indicator */}
                    <circle cx="35" cy="16" r="8" stroke="#1F2445" strokeWidth="3" fill="#FFFFFF" />
                    <circle cx="35" cy="16" r="3.5" fill="#1F2445" />

                    {/* Body */}
                    <path d="M 22 90 L 22 75 Q 22 60 50 60 Q 78 60 78 75 L 78 90" fill="#78A5D2" stroke="#1F2445" strokeWidth="3" strokeLinecap="round" className="opacity-95" />
                    {/* Raised Arms */}
                    <path d="M 15 90 L 15 65 Q 15 45 35 45 M 85 90 L 85 65 Q 85 45 65 45" stroke="#1F2445" strokeWidth="3" strokeLinejoin="round" fill="none" />
                    <path d="M 15 90 L 15 65 Q 15 45 35 45 L 42 58" fill="#9CC3E5" className="opacity-80" />
                    <path d="M 85 90 L 85 65 Q 85 45 65 45 L 58 58" fill="#9CC3E5" className="opacity-80" />

                    {/* Face */}
                    <circle cx="50" cy="46" r="16" fill="#F8CFC3" stroke="#1F2445" strokeWidth="3" />

                    {/* Eyes and Mouth */}
                    <circle cx="45" cy="43" r="1.5" fill="#1F2445" />
                    <circle cx="55" cy="43" r="1.5" fill="#1F2445" />
                    <path d="M 47 49 Q 50 51 53 49" stroke="#1F2445" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Hair */}
                    <path d="M 33 48 Q 28 30 50 28 Q 72 30 67 48 Q 62 38 50 38 Q 38 38 33 48" fill="#907784" stroke="#1F2445" strokeWidth="3" strokeLinejoin="round" />

                    {/* Hands */}
                    <circle cx="35" cy="46" r="5" fill="#F8CFC3" stroke="#1F2445" strokeWidth="3" />
                    <circle cx="65" cy="46" r="5" fill="#F8CFC3" stroke="#1F2445" strokeWidth="3" />

                    {/* Base ground line */}
                    <path d="M 10 90 L 90 90" stroke="#1F2445" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </div>

            {/* Typography and interactive button area */}
            <div className="flex flex-col items-start justify-center gap-1 sm:gap-1.5 relative z-10 pt-0.5">
                <span className="text-[13px] sm:text-[14px] font-[800] text-[#1F2445] tracking-tight whitespace-nowrap leading-[1.1]">
                    Feeling Overwhelmed?
                </span>

                <div className="flex items-center justify-center gap-1 bg-[#36A2A4] group-hover:bg-[#309092] transition-colors text-white px-3 sm:px-4 py-1 sm:py-1 rounded-[12px] font-semibold text-[10px] sm:text-[11px] shadow-[0_2px_8px_rgba(54,162,164,0.35)] pointer-events-none">
                    Get Help
                    <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Sun/Burst icon matching image */}
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </button>
    );
}
