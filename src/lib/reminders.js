// Lightweight global reminder scheduler.
// When a reminder fires it dispatches an in-app toast event (guaranteed visible)
// AND tries a browser notification (best-effort). The in-app toast is why this
// works even if the user blocked OS notifications.

export async function ensureNotificationPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'default') {
        try { return await Notification.requestPermission(); } catch { return 'denied'; }
    }
    return Notification.permission;
}

export function scheduleReminder({ delayMs, message, style = 'Standard' }) {
    const delay = Math.max(0, delayMs);
    window.setTimeout(() => {
        // 1) In-app toast — always shows (see ReminderToast in the layout).
        try {
            window.dispatchEvent(new CustomEvent('neurosync-reminder', { detail: { message, style } }));
        } catch { /* ignore */ }
        // 2) OS notification — best-effort.
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('NeuroSync', { body: message, requireInteraction: style === 'Persistent' });
            }
        } catch { /* ignore */ }
    }, delay);
}
