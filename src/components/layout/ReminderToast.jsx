import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

// Listens for 'neurosync-reminder' events and shows an in-app toast.
// Guarantees the user sees the reminder even if OS notifications are blocked.
export default function ReminderToast() {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handler = (e) => setToast({
            message: e.detail?.message || 'Time for your task.',
            style: e.detail?.style || 'Standard',
        });
        window.addEventListener('neurosync-reminder', handler);
        return () => window.removeEventListener('neurosync-reminder', handler);
    }, []);

    useEffect(() => {
        if (toast && toast.style !== 'Persistent') {
            const id = setTimeout(() => setToast(null), 12000);
            return () => clearTimeout(id);
        }
    }, [toast]);

    if (!toast) return null;

    return (
        <div className="fixed top-5 right-5 z-[60] max-w-sm flex items-start gap-3 bg-white border border-[var(--color-border-color)] rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-9 h-9 rounded-full bg-[var(--color-success-bg)] text-[var(--color-brand-end)] flex items-center justify-center shrink-0">
                <Bell size={18} />
            </div>
            <div className="flex-1">
                <p className="text-[13px] font-bold text-[var(--color-text-primary)]">NeuroSync reminder</p>
                <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} aria-label="Dismiss reminder" className="text-gray-400 hover:text-gray-600">
                <X size={16} />
            </button>
        </div>
    );
}
