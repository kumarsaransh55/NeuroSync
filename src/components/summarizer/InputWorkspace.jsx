import React, { useState } from 'react';
import UploadZone from './UploadZone';
import { Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../../api/client';

// Map the backend DocumentAnalysisResult into the shape the result cards expect.
const mapAnalysis = (d = {}) => {
    const noDeadline = !d.deadline || /no specific deadline|none/i.test(d.deadline);
    const tone = d.tone || 'Neutral';
    return {
        summary: d.summary || '',
        actionItems: (d.actionItems || []).map((text, i) => ({ id: i + 1, text, completed: false })),
        deadlines: noDeadline
            ? []
            : [{
                id: 1,
                task: 'Deadline mentioned',
                date: d.deadline,
                urgency: /urgent|today|asap|tomorrow/i.test(d.deadline) ? 'high' : 'medium',
            }],
        tone: { primary: tone, secondary: '', warning: /(urgent|demanding|angry|critical)/i.test(tone) },
        hiddenTasks: (d.hiddenTasks || []).map((text, i) => ({ id: i + 1, text, context: 'Implied by the message' })),
        highlights: d.highlights || [],
        simplified: d.simplifiedText || '',
    };
};

export default function InputWorkspace({ onAnalyzeComplete }) {
    const [textContent, setTextContent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzingStatus, setAnalyzingStatus] = useState('');
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileSelect = (file) => {
        if (!file) return;
        setErrorMsg('');
        setIsAnalyzing(true);
        setAnalyzingStatus(`Reading ${file.name}...`);

        const reader = new FileReader();
        reader.onload = (e) => {
            setTextContent(String(e.target?.result || ''));
            setIsAnalyzing(false);
            setAnalyzingStatus('');
        };
        reader.onerror = () => {
            setErrorMsg('Could not read that file. Please paste the text instead.');
            setIsAnalyzing(false);
            setAnalyzingStatus('');
        };
        reader.readAsText(file);
    };

    const handleGenerateSummary = async () => {
        if (!textContent.trim()) return;

        setErrorMsg('');
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        setAnalyzingStatus('NeuroSync is reading your text...');

        try {
            const data = await api.analyzeDocument(textContent);
            if (onAnalyzeComplete) onAnalyzeComplete(mapAnalysis(data));
            setAnalysisComplete(true);
            setTimeout(() => setAnalysisComplete(false), 3000);
        } catch (error) {
            setErrorMsg(error.message || 'Could not analyze the text. Please try again.');
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus('');
        }
    };

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)] relative overflow-hidden">
            {/* Loading Overlay */}
            {isAnalyzing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[var(--radius-card)]">
                    <div className="relative">
                        <Loader2 size={48} className="text-[var(--color-brand-start)] animate-spin" />
                        <Sparkles size={20} className="text-purple-500 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <p className="mt-4 text-[16px] font-bold text-gray-800 tracking-wide">{analyzingStatus}</p>
                    <p className="text-[13px] text-gray-500 mt-1">This may take a few seconds...</p>
                </div>
            )}

            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Input Content</h2>

            {/* Error banner */}
            {errorMsg && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 text-red-700 border border-red-100 rounded-[var(--radius-btn)] p-3 text-[13px]">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Main Textarea */}
            <div className="mb-6">
                <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full h-[140px] p-3 border border-[var(--color-border-color)] rounded-[var(--radius-btn)] resize-none focus:outline-none focus:border-[var(--color-brand-start)] focus:ring-1 focus:ring-[var(--color-brand-start)] transition-colors text-[14px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] leading-relaxed"
                    placeholder="Paste your email or document here..."
                ></textarea>
            </div>

            {/* File Upload Zone */}
            <div className="mb-6 relative z-0">
                <UploadZone onFileSelect={handleFileSelect} />
            </div>

            {/* AI Control — a single analyze action (the backend does it all in one call) */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleGenerateSummary}
                    disabled={!textContent.trim() || isAnalyzing}
                    className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-gradient-to-r from-[var(--color-brand-start)] to-[var(--color-brand-mid)] text-white font-medium text-[14px] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    {analysisComplete ? (
                        <><CheckCircle2 size={16} /> Analysis Complete</>
                    ) : (
                        <><Sparkles size={16} /> Analyze with NeuroSync</>
                    )}
                </button>
                <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                    One click gives you the summary, action items, deadlines, hidden tasks, key points and a dyslexia-friendly rewrite. Use the <span className="font-medium">Simplify</span> / <span className="font-medium">Dyslexia</span> toggles above to change how the result reads.
                </p>
            </div>
        </div>
    );
}
