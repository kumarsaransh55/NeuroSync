import React from 'react';
import { Video } from 'lucide-react';

export default function ReminderCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 shadow-sm border border-[var(--color-border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col justify-between h-full">

            <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-4">Reminders</h3>

            <div className="flex-1 flex flex-col justify-center gap-4">
                <div>
                    <h4 className="text-[20px] font-bold text-[var(--color-brand-start)] leading-tight mb-2">
                        Meeting with Arc<br />Company
                    </h4>
                    <p className="text-[12px] text-[var(--color-text-secondary)] font-medium">Time : 02.00 pm - 04.00 pm</p>
                </div>

                <button className="mt-4 w-full py-3 px-4 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm hover:scale-[1.02]">
                    <Video size={18} />
                    Start Meeting
                </button>
            </div>

        </div>
    );
}
