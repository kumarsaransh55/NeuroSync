import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

const defaultSettings = {
    // Accessibility
    fontSize: 2, // 1=small, 2=medium, 3=large
    dyslexiaFont: false,
    colorTheme: 'light', // light, dark, system
    highContrast: false,

    // Notifications
    reminderType: 'push', // push, email, both, none
    reminderFrequency: 'daily', // hourly, daily, weekly
    notificationChannel: 'all', // all, mentions, none

    // Focus Mode
    timerLength: 25, // in minutes
    breakDuration: 5, // in minutes
    focusTheme: 'calm', // calm, energetic, minimal

    // AI Preferences
    aiSuggestionLevel: 'moderate', // low, moderate, high
    summaryLength: 'concise', // concise, detailed, bulleted
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('neurosync_settings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('neurosync_settings', JSON.stringify(settings));

        // Apply Accessibility side-effects globally to the document
        const html = document.documentElement;

        // Handle Font Size
        const fontSizeMap = {
            1: 'small',
            2: 'medium',
            3: 'large'
        };
        html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
        html.classList.add(`font-size-${fontSizeMap[settings.fontSize] || 'medium'}`);

        // Handle Dyslexia Font
        if (settings.dyslexiaFont) {
            html.classList.add('font-dyslexia');
        } else {
            html.classList.remove('font-dyslexia');
        }

        // Handle High Contrast
        if (settings.highContrast) {
            html.classList.add('high-contrast');
        } else {
            html.classList.remove('high-contrast');
        }

        // Handle Color Theme (basic implementation, could be expanded)
        if (settings.colorTheme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

    }, [settings]);

    const updateSetting = (category, key, value) => {
        // Flat state structure makes update easier, assuming top-level keys
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};
