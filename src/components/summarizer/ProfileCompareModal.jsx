import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Loader2, AlertTriangle, User, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../api/client';

// Side-by-side proof of the adaptive-output USP: the SAME email, analyzed under
// two different personalization profiles, so you can literally see it re-shape
// itself for a different brain. Each column re-fetches when its profile changes.

const PRESETS = {
    yours: { label: 'Your profile' },
    standard: { label: 'Standard (no personalization)', profile: null },
    plain: { label: 'Plain & simple', profile: { simpleLanguage: true, oneThingAtATime: true, stepSize: 'small', showTimeEstimates: true } },
    big: { label: 'Fewer, bigger steps', profile: { simpleLanguage: false, stepSize: 'large' } },
};

function CompareColumn({ sourceText, initialPreset, userProfile }) {
    const [presetKey, setPresetKey] = useState(initialPreset);
    const [state, setState] = useState({ loading: true, error: '', data: null });

    useEffect(() => {
        let cancelled = false;
        setState({ loading: true, error: '', data: null });
        const profile = presetKey === 'yours' ? userProfile : PRESETS[presetKey].profile;
        api.analyzeDocumentAs(sourceText, profile)
            .then((d) => { if (!cancelled) setState({ loading: false, error: '', data: d }); })
            .catch((e) => { if (!cancelled) setState({ loading: false, error: e.message || 'Could not analyze.', data: null }); });
        return () => { cancelled = true; };
    }, [presetKey, sourceText, userProfile]);

    const { loading, error, data } = state;

    return (
        <div className="flex flex-col min-h-0">
            <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] mb-1.5">Profile</label>
            <div className="relative mb-4">
                <select
                    value={presetKey}
                    onChange={(e) => setPresetKey(e.target.value)}
                    className="w-full text-[13px] font-medium border border-[var(--color-border-color)] rounded-[var(--radius-btn)] pl-3 pr-8 py-2 outline-none focus:border-[var(--color-brand-start)] bg-white appearance-none"
                >
                    {Object.entries(PRESETS).map(([key, p]) => (
                        <option key={key} value={key}>{p.label}</option>
                    ))}
                </select>
                <Sparkles size={14} className="absolute right-3 top-2.5 text-[var(--color-brand-start)] pointer-events-none" />
            </div>

            <div className="flex-1 overflow-y-auto bg-[var(--color-bg-light)] rounded-[var(--radius-card)] border border-[var(--color-border-color)] p-4 min-h-[260px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] py-10">
                        <Loader2 size={28} className="animate-spin text-[var(--color-brand-start)]" />
                        <p className="text-[13px] mt-3">Adapting to this profile…</p>
                    </div>
                ) : error ? (
                    <div className="flex items-start gap-2 text-red-700 text-[13px]">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Summary</h4>
                            <p className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">{data?.summary || '—'}</p>
                        </div>
                        {data?.simplifiedText && (
                            <div>
                                <h4 className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Simplified rewrite</h4>
                                <div className="text-[14px] text-[var(--color-text-primary)] leading-relaxed prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_h1]:font-bold [&_h2]:font-semibold [&_p]:mb-2">
                                    <ReactMarkdown>{data.simplifiedText}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProfileCompareModal({ isOpen, onClose, sourceText }) {
    const { settings } = useSettings();

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // The "Your profile" column uses the user's saved personalization fields.
    const userProfile = {
        simpleLanguage: settings.simpleLanguage,
        stepSize: settings.stepSize,
        oneThingAtATime: settings.oneThingAtATime,
        showTimeEstimates: settings.showTimeEstimates,
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--color-brand-start)]/80 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[var(--color-card-bg)] rounded-[24px] shadow-2xl p-6 sm:p-8 flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-label="Close comparison"
                >
                    <X size={20} />
                </button>

                <div className="mb-5 pr-10">
                    <h2 className="text-[20px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        <User size={18} className="text-[var(--color-brand-start)]" /> Same email, two profiles
                    </h2>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">
                        One input, adapted to how each person thinks. Switch either profile to see the rewrite change.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-0">
                    <CompareColumn sourceText={sourceText} initialPreset="yours" userProfile={userProfile} />
                    <CompareColumn sourceText={sourceText} initialPreset="standard" userProfile={userProfile} />
                </div>
            </div>
        </div>
    );
}
