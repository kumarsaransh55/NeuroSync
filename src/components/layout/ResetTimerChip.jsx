import React, { useEffect, useState } from 'react';
import { Timer, X } from 'lucide-react';
import { useFocus } from '../../context/FocusContext';

// Floating countdown shown while a "5-minute reset" is running.
export default function ResetTimerChip() {
    const { resetEndsAt, cancelReset } = useFocus();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!resetEndsAt) return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [resetEndsAt]);

    if (!resetEndsAt) return null;

    const secs = Math.max(0, Math.round((resetEndsAt - now) / 1000));
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');

    return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[var(--color-brand-start)] text-white px-4 py-3 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <Timer size={18} />
            <div className="leading-tight">
                <p className="text-[11px] opacity-80">Reset timer</p>
                <p className="text-[16px] font-bold tabular-nums">{mm}:{ss}</p>
            </div>
            <button onClick={cancelReset} aria-label="Cancel reset timer" className="ml-1 text-white/80 hover:text-white">
                <X size={16} />
            </button>
        </div>
    );
}
