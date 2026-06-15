import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function SettingsPage() {
    const { settings, updateSetting } = useSettings();

    const handleSettingChange = (category, key, value) => {
        updateSetting(category, key, value);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 md:px-8 pt-1 pb-8 space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] mb-2">Settings</h1>
                <p className="text-[15px] text-[var(--color-text-muted)]">Manage your preferences and interface options across NeuroSync.</p>
            </div>

            {/* Accessibility */}
            <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[var(--color-border-color)]">
                <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border-color)] flex items-center gap-2">
                    <span className="text-[var(--color-brand-start)] text-[22px]">👁</span> Accessibility
                </h2>

                <div className="space-y-5">
                    {/* Font Size */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Font Size</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Adjust the text size for readability.</p>
                        </div>
                        <div className="w-full sm:w-[200px] flex items-center gap-3">
                            <span className="text-[12px] font-medium text-[var(--color-text-muted)]">A</span>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="1"
                                value={settings.fontSize}
                                onChange={(e) => handleSettingChange('accessibility', 'fontSize', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-start)]"
                            />
                            <span className="text-[18px] font-bold text-[var(--color-text-primary)]">A</span>
                        </div>
                    </div>

                    {/* Dyslexia Font */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Dyslexia Font</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Use OpenDyslexic for better comprehension.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.dyslexiaFont}
                                onChange={(e) => handleSettingChange('accessibility', 'dyslexiaFont', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>

                    {/* Color Theme */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Color Theme</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Choose your preferred application theme.</p>
                        </div>
                        <select
                            value={settings.colorTheme}
                            onChange={(e) => handleSettingChange('accessibility', 'colorTheme', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System Default</option>
                        </select>
                    </div>

                    {/* High Contrast */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">High Contrast</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Enhance interface contrast for better visibility.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.highContrast}
                                onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Personalization */}
            <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[var(--color-border-color)]">
                <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                    <span className="text-[var(--color-brand-start)] text-[22px]">🧠</span> Personalization
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-4 pb-3 border-b border-[var(--color-border-color)]">These shape how the AI writes for you and how it reminds you — no labels, no diagnosis.</p>

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Simpler language</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Shorter sentences, plainer words, more bullet points.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.simpleLanguage} onChange={(e) => handleSettingChange('profile', 'simpleLanguage', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Break tasks into</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">How granular the AI's micro-steps are.</p>
                        </div>
                        <select value={settings.stepSize} onChange={(e) => handleSettingChange('profile', 'stepSize', e.target.value)} className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5">
                            <option value="small">Lots of small steps</option>
                            <option value="medium">No preference</option>
                            <option value="large">A few bigger steps</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">One thing at a time</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Each step is a single, clear action.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.oneThingAtATime} onChange={(e) => handleSettingChange('profile', 'oneThingAtATime', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Show time estimates</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Add a realistic time to each step.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.showTimeEstimates} onChange={(e) => handleSettingChange('profile', 'showTimeEstimates', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Reminder style</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">How firm reminders should feel.</p>
                        </div>
                        <select value={settings.reminderStyle} onChange={(e) => handleSettingChange('profile', 'reminderStyle', e.target.value)} className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5">
                            <option value="gentle">Gentle</option>
                            <option value="standard">Standard</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Reduce motion</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Minimise animations across the app.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.reducedMotion} onChange={(e) => handleSettingChange('profile', 'reducedMotion', e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-brand-start)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand-start)]"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[var(--color-border-color)]">
                <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border-color)] flex items-center gap-2">
                    <span className="text-[var(--color-brand-start)] text-[22px]">🔔</span> Notifications
                </h2>

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Reminder Type</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">How you want to receive task reminders.</p>
                        </div>
                        <select
                            value={settings.reminderType}
                            onChange={(e) => handleSettingChange('notifications', 'reminderType', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="push">Push Notification</option>
                            <option value="email">Email</option>
                            <option value="both">Both</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Reminder Frequency</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">How often to remind about uncompleted tasks.</p>
                        </div>
                        <select
                            value={settings.reminderFrequency}
                            onChange={(e) => handleSettingChange('notifications', 'reminderFrequency', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Notification Channel</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Select which platform updates you receive.</p>
                        </div>
                        <select
                            value={settings.notificationChannel}
                            onChange={(e) => handleSettingChange('notifications', 'notificationChannel', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="all">All notifications</option>
                            <option value="mentions">Mentions only</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Focus Mode */}
            <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[var(--color-border-color)]">
                <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border-color)] flex items-center gap-2">
                    <span className="text-[var(--color-brand-start)] text-[22px]">🎯</span> Focus Mode
                </h2>

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Timer Length (Minutes)</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Duration of a single focus session.</p>
                        </div>
                        <input
                            type="number"
                            min="5" max="120"
                            value={settings.timerLength}
                            onChange={(e) => handleSettingChange('focusMode', 'timerLength', parseInt(e.target.value) || 25)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-[120px] p-2.5 text-center"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Break Duration (Minutes)</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Duration of short breaks in between flows.</p>
                        </div>
                        <input
                            type="number"
                            min="1" max="60"
                            value={settings.breakDuration}
                            onChange={(e) => handleSettingChange('focusMode', 'breakDuration', parseInt(e.target.value) || 5)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-[120px] p-2.5 text-center"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Focus Theme</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Vibe during focus tracking sessions.</p>
                        </div>
                        <select
                            value={settings.focusTheme}
                            onChange={(e) => handleSettingChange('focusMode', 'focusTheme', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="calm">Calm (Default)</option>
                            <option value="energetic">Energetic</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* AI Preferences */}
            <section className="bg-white rounded-[20px] p-5 sm:p-6 shadow-sm border border-[var(--color-border-color)]">
                <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border-color)] flex items-center gap-2">
                    <span className="text-[var(--color-brand-start)] text-[22px]">✨</span> AI Preferences
                </h2>

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">AI Suggestion Level</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">How frequently AI interrupts with suggestions.</p>
                        </div>
                        <select
                            value={settings.aiSuggestionLevel}
                            onChange={(e) => handleSettingChange('aiPreferences', 'aiSuggestionLevel', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="low">Low</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-medium text-[var(--color-text-primary)] mb-1">Summary Length</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Preferred generated AI outputs size formatting.</p>
                        </div>
                        <select
                            value={settings.summaryLength}
                            onChange={(e) => handleSettingChange('aiPreferences', 'summaryLength', e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-[var(--color-text-primary)] rounded-[12px] focus:ring-[var(--color-brand-start)] focus:border-[var(--color-brand-start)] block w-full sm:w-auto p-2.5"
                        >
                            <option value="concise">Concise / Brief</option>
                            <option value="bulleted">Bullet Points</option>
                            <option value="detailed">Detailed</option>
                        </select>
                    </div>
                </div>
            </section>

        </div>
    );
}
