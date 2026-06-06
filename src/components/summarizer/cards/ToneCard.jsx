import React from 'react';
import { AlertCircle, ThumbsUp } from 'lucide-react';

export default function ToneCard({ data }) {
    if (!data || !data.primary) return null;

    const isUrgent = /urgent|demanding|critical|angry|frustrat/i.test(data.primary);
    const bgColor = isUrgent ? 'bg-[#FEE2E2] border-[#FCA5A5]' : 'bg-blue-50 border-blue-200';
    const textColor = isUrgent ? 'text-[#991B1B]' : 'text-blue-700';

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Tone Analysis</h3>

            <div className="flex items-center gap-3">
                <div className={`${bgColor} ${textColor} px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 w-fit border`}>
                    {isUrgent ? <AlertCircle size={14} strokeWidth={2.5} /> : <ThumbsUp size={14} strokeWidth={2.5} />}
                    {data.primary}
                </div>
                <span className="text-[13px] text-[var(--color-text-muted)] mt-0.5">Primary sentiment</span>
            </div>

            <p className="text-[13px] text-[var(--color-text-secondary)] mt-4 leading-relaxed">
                The message reads as <span className="font-semibold">{data.primary.toLowerCase()}</span>
                {data.secondary ? <> — with an undertone of <span className="font-medium text-gray-700">{data.secondary.toLowerCase()}</span></> : null}.
            </p>
        </div>
    );
}
