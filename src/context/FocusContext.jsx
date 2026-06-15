import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const FocusContext = createContext(null);

export const useFocus = () => {
    const ctx = useContext(FocusContext);
    if (!ctx) throw new Error('useFocus must be used within a FocusProvider');
    return ctx;
};

// Shared focus-mode + "reset timer" state so the header's "Feeling overwhelmed"
// actions can drive focus mode on the Tasks page and start a visible countdown.
export const FocusProvider = ({ children }) => {
    const [focusMode, setFocusMode] = useState(false);
    // The task a focus session is running on (drives the FocusSession overlay).
    const [focusTaskId, setFocusTaskId] = useState(null);
    const [resetEndsAt, setResetEndsAt] = useState(null);
    const timerRef = useRef(null);

    // Enter a focus session for a specific task (from the dashboard or Tasks page).
    const startFocus = useCallback((taskId = null) => {
        setFocusTaskId(taskId);
        setFocusMode(true);
    }, []);

    // Leave the focus session.
    const stopFocus = useCallback(() => {
        setFocusMode(false);
        setFocusTaskId(null);
    }, []);

    const cancelReset = useCallback(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        setResetEndsAt(null);
    }, []);

    const startReset = useCallback((minutes = 5) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const ms = minutes * 60 * 1000;
        setResetEndsAt(Date.now() + ms);
        timerRef.current = setTimeout(() => {
            setResetEndsAt(null);
            timerRef.current = null;
            try {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('NeuroSync', { body: 'Your reset is complete — ready to ease back in?' });
                }
            } catch { /* notifications unavailable */ }
        }, ms);
        // Ask for permission so the end-of-timer nudge can appear.
        try {
            if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
        } catch { /* ignore */ }
    }, []);

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return (
        <FocusContext.Provider value={{ focusMode, setFocusMode, focusTaskId, startFocus, stopFocus, resetEndsAt, startReset, cancelReset }}>
            {children}
        </FocusContext.Provider>
    );
};
