import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Sparkles, X } from 'lucide-react';

// Opt-in, no-diagnosis questionnaire shown once after signup. The answers build
// the user's personalization profile (saved to the DB + injected into the AI).
const QUESTIONS = [
    {
        key: 'simpleLanguage', q: 'When a long email or document lands, how does it feel?',
        options: [{ v: true, label: 'It’s a lot — keep things short & simple' }, { v: false, label: 'Usually manageable' }],
    },
    {
        key: 'stepSize', q: 'How should we break big tasks down?',
        options: [{ v: 'small', label: 'Lots of small steps' }, { v: 'large', label: 'A few bigger steps' }, { v: 'medium', label: 'No preference' }],
    },
    {
        key: 'oneThingAtATime', q: 'Is it easier to focus on one thing at a time?',
        options: [{ v: true, label: 'Yes' }, { v: false, label: 'Not really' }],
    },
    {
        key: 'showTimeEstimates', q: 'Do time estimates on steps help you?',
        options: [{ v: true, label: 'Yes, show them' }, { v: false, label: 'No, hide them' }],
    },
    {
        key: 'reminderStyle', q: 'Do reminders help you or stress you?',
        options: [{ v: 'gentle', label: 'They help — keep them gentle' }, { v: 'minimal', label: 'Keep them minimal' }, { v: 'standard', label: 'Standard is fine' }],
    },
    {
        key: 'dyslexiaFont', q: 'Reading comfort:',
        options: [{ v: true, label: 'Use a dyslexia-friendly font' }, { v: false, label: 'Standard font' }],
    },
    {
        key: 'reducedMotion', q: 'Motion & animations:',
        options: [{ v: true, label: 'Reduce them' }, { v: false, label: 'I’m fine with them' }],
    },
];

export default function OnboardingModal() {
    const { settings, updateSettings } = useSettings();
    const [answers, setAnswers] = useState(() => {
        const init = {};
        QUESTIONS.forEach((q) => { init[q.key] = settings[q.key]; });
        return init;
    });

    if (settings.onboarded) return null;

    const set = (key, v) => setAnswers((prev) => ({ ...prev, [key]: v }));
    const save = () => updateSettings({ ...answers, onboarded: true });
    const skip = () => updateSettings({ onboarded: true });

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] overflow-y-auto">
                <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-brand-start)] to-[var(--color-brand-end)] flex items-center justify-center text-white shrink-0">
                                <Sparkles size={16} />
                            </div>
                            <h2 className="text-[19px] font-bold text-[var(--color-text-primary)]">Make NeuroSync yours</h2>
                        </div>
                        <button onClick={skip} aria-label="Skip" className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mb-5 leading-relaxed">
                        A few quick, optional questions — no labels, no diagnosis. We use these to adapt how NeuroSync writes and reminds you. You can change them anytime in Settings.
                    </p>

                    <div className="space-y-5">
                        {QUESTIONS.map(({ key, q, options }) => (
                            <div key={key}>
                                <p className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-2">{q}</p>
                                <div className="flex flex-wrap gap-2">
                                    {options.map((o) => {
                                        const active = answers[key] === o.v;
                                        return (
                                            <button
                                                key={String(o.v)}
                                                onClick={() => set(key, o.v)}
                                                className={`px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${active ? 'bg-[var(--color-brand-start)] text-white border-[var(--color-brand-start)]' : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--color-brand-start)]'}`}
                                            >
                                                {o.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button onClick={skip} className="text-[14px] font-medium text-gray-500 hover:text-gray-700">Skip for now</button>
                        <button onClick={save} className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-start)] text-white font-semibold text-[14px] hover:bg-[var(--color-brand-mid)]">Save &amp; personalize</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
