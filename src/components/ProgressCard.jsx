import React from 'react';

export default function ProgressCard() {
    const percentage = 41;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 shadow-sm border border-[var(--color-border-color)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col items-center justify-between">

            <div className="w-full text-left mb-2">
                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Project Progress</h3>
            </div>

            {/* Circular Progress */}
            <div className="relative flex items-center justify-center flex-1 w-full my-6">
                <svg className="w-[180px] h-[180px] -rotate-90 transform" viewBox="0 0 160 160">
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--color-brand-start)" />
                            <stop offset="100%" stopColor="var(--color-brand-end)" />
                        </linearGradient>
                        <pattern id="diagonalStripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="#E5E7EB" strokeWidth="4" />
                        </pattern>
                    </defs>

                    {/* Background circle (striped part representing pending) */}
                    <circle
                        cx="80" cy="80" r={radius}
                        fill="none"
                        stroke="url(#diagonalStripes)"
                        strokeWidth="24"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="80" cy="80" r={radius}
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="24"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[36px] font-bold text-[var(--color-text-primary)] leading-none">{percentage}%</span>
                    <span className="text-[12px] font-medium text-[var(--color-text-secondary)] mt-1">Project Ended</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 w-full text-[11px] font-medium text-[var(--color-text-secondary)] pb-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-end)]"></div>
                    Completed
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-start)]"></div>
                    In Progress
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, #E5E7EB 2px, #E5E7EB 4px)" }}></div>
                    </div>
                    Pending
                </div>
            </div>

        </div>
    );
}
