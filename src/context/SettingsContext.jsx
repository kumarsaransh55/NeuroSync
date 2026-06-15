import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api, getToken } from '../api/client';

const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

const SETTINGS_KEY = 'neurosync_settings';

const defaultSettings = {
    // Accessibility
    fontSize: 2, // 1=small, 2=medium, 3=large
    dyslexiaFont: false,
    colorTheme: 'light', // light, dark, system
    highContrast: false,
    reducedMotion: false,

    // Notifications
    reminderType: 'push',
    reminderFrequency: 'daily',
    notificationChannel: 'all',

    // Focus Mode
    timerLength: 25,
    breakDuration: 5,
    focusTheme: 'calm',

    // AI Preferences
    aiSuggestionLevel: 'moderate',
    summaryLength: 'concise',

    // Personalization profile (set during onboarding, editable in Settings,
    // and injected into the AI prompts so output adapts to the user).
    onboarded: false,
    simpleLanguage: false,     // shorter sentences, plainer words, bullets
    stepSize: 'medium',        // small | medium | large
    oneThingAtATime: false,
    showTimeEstimates: true,
    reminderStyle: 'standard', // gentle | standard | minimal
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });
    const [hydrated, setHydrated] = useState(!getToken());
    const loadedDb = useRef(false);
    const saveTimer = useRef(null);

    // Persist locally + apply accessibility side-effects to the document.
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        const html = document.documentElement;

        const fontSizeMap = { 1: 'small', 2: 'medium', 3: 'large' };
        html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
        html.classList.add(`font-size-${fontSizeMap[settings.fontSize] || 'medium'}`);

        html.classList.toggle('font-dyslexia', !!settings.dyslexiaFont);
        html.classList.toggle('high-contrast', !!settings.highContrast);
        html.classList.toggle('dark', settings.colorTheme === 'dark');
        html.classList.toggle('reduce-motion', !!settings.reducedMotion);
    }, [settings]);

    // Load saved settings from the DB on login (merge over defaults/local).
    useEffect(() => {
        if (loadedDb.current || !getToken()) return;
        loadedDb.current = true;
        api.getSettings()
            .then((db) => {
                if (db && typeof db === 'object' && Object.keys(db).length) {
                    setSettings((prev) => ({ ...prev, ...db }));
                }
            })
            .catch(() => { /* backend not reachable — keep local */ })
            .finally(() => setHydrated(true));
    }, []);

    // Save to the DB on change (debounced) — only after the initial DB load, so
    // we never overwrite the saved profile with stale local defaults.
    useEffect(() => {
        if (!hydrated || !getToken()) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => { api.saveSettings(settings).catch(() => {}); }, 800);
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    }, [settings, hydrated]);

    const updateSetting = (category, key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    // Update several keys at once (used by the onboarding questionnaire).
    const updateSettings = (patch) => {
        setSettings((prev) => ({ ...prev, ...patch }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
