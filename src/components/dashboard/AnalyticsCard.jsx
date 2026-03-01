import React from 'react';

const data = [
    { day: 'S', value: 45, type: 'striped' },
    { day: 'M', value: 75, type: 'solid-mid' },
    { day: 'T', value: 74, type: 'solid-light', active: true },
    { day: 'W', value: 90, type: 'solid-dark' },
    { day: 'T', value: 55, type: 'striped' },
    { day: 'F', value: 65, type: 'striped' },
    { day: 'S', value: 50, type: 'striped' },
];

export default function AnalyticsCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 shadow-sm border border-[var(--color-border-color)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col">
            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-6">Project Analytics</h3>

            <div className="flex-1 flex items-end justify-between gap-2 mt-auto pb-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 w-full">
                        {/* Tooltip for active */}
                        {item.active && (
                            <div className="relative bg-white border border-[var(--color-border-color)] shadow-sm text-[10px] font-bold text-[var(--color-text-primary)] py-1 px-2 rounded-md mb-1 z-10">
                                {item.value}%
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-[var(--color-border-color)] rotate-45"></div>
                            </div>
                        )}
                        {!item.active && <div className="h-7"></div>} {/* Spacer to keep alignment */}

                        {/* Bar */}
                        <div className="relative w-full max-w-[40px] h-[140px] bg-gray-50 rounded-full overflow-hidden flex items-end">
                            <div
                                style={{ height: `${item.value}%` }}
                                className={`w-full rounded-full transition-all duration-500 ease-out ${item.type === 'striped'
                                        ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CjxwYXRoIGQ9Ik0wIDEwbDIwLTIwTTEwIDIwbDIwLTIwIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMiIvPgo8L2c+Cjwvc3ZnPg==")] bg-gray-100' // Base64 diagonal lines wait I'll use simple CSS for stripes or just solid colors. 
                                        : item.type === 'solid-dark' ? 'bg-[var(--color-brand-start)]'
                                            : item.type === 'solid-mid' ? 'bg-[var(--color-brand-mid)]'
                                                : 'bg-[#67D59A]' // light green
                                    }`}
                            >
                                {/* Simplified Stripes with CSS instead of SVG to be safe */}
                                {item.type === 'striped' && (
                                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, var(--color-brand-end) 4px, var(--color-brand-end) 6px)" }}></div>
                                )}
                            </div>

                            {/* Active Dot */}
                            {item.active && (
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                            )}
                        </div>

                        {/* Label */}
                        <span className="text-[12px] font-medium text-[var(--color-text-muted)] mt-1">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
