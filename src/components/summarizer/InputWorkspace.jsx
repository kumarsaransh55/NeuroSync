import React, { useState } from 'react';
import UploadZone from './UploadZone';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InputWorkspace({ onAnalyzeComplete }) {
    const [textContent, setTextContent] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzingStatus, setAnalyzingStatus] = useState('');
    const [analysisComplete, setAnalysisComplete] = useState(false);

    const handleFileSelect = (file) => {
        // Simulate file reading/parsing
        setIsAnalyzing(true);
        setAnalyzingStatus('Extracting text from document...');
        setAnalysisComplete(false);

        setTimeout(() => {
            setTextContent(`[Extracted from ${file.name}]\n\nWe are excited to announce Q3 planning...`);
            setIsAnalyzing(false);
            setAnalyzingStatus('');
        }, 1500);
    };

    const handleGenerateSummary = () => {
        if (!textContent.trim()) return;

        setIsAnalyzing(true);
        setAnalysisComplete(false);
        setAnalyzingStatus('AI is analyzing content...');

        setTimeout(() => {
            setAnalyzingStatus('Generating key highlights...');
            setTimeout(() => {
                setAnalyzingStatus('Extracting action items...');
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setAnalyzingStatus('');
                    setAnalysisComplete(true);

                    // Pass mock data up to parent
                    if (onAnalyzeComplete) {
                        onAnalyzeComplete({
                            summary: "The attached document outlines the Q3 planning initiatives. Key focuses are adjusting the marketing budget to prioritize digital campaigns over print, and launching the new product line feature by mid-August.",
                            actionItems: [
                                { id: 1, text: "Review redistributed marketing budget", completed: false },
                                { id: 2, text: "Finalize August launch timeline", completed: false },
                                { id: 3, text: "Schedule sync with print vendors to cancel orders", completed: false }
                            ],
                            deadlines: [
                                { id: 1, task: "Marketing Budget Review", date: "July 15, 2026", urgency: "high" },
                                { id: 2, task: "Cancel Print Orders", date: "July 20, 2026", urgency: "medium" },
                                { id: 3, task: "New Feature Launch", date: "August 15, 2026", urgency: "high" }
                            ],
                            tone: { primary: "Urgent", secondary: "Optimistic", warning: false },
                            hiddenTasks: [
                                { id: 1, text: "Inform creative team of digital pivot", context: "Implied by budget shift" }
                            ],
                            highlights: [
                                "Pivot to digital marketing",
                                "August 15th feature launch date",
                                "Budget reallocation required"
                            ],
                            simplified: "We are changing our Q3 plan. We will spend more money on internet ads and less on paper ads. We need to finish our new product feature by August 15th so we can launch it."
                        });
                    }

                    // Reset success message after a few seconds
                    setTimeout(() => setAnalysisComplete(false), 3000);
                }, 1000);
            }, 1000);
        }, 1000);
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

            {/* AI Control Buttons */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={handleGenerateSummary}
                    disabled={!textContent.trim() || isAnalyzing}
                    className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-gradient-to-r from-[var(--color-brand-start)] to-[var(--color-brand-mid)] text-white font-medium text-[14px] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {analysisComplete ? (
                        <><CheckCircle2 size={16} /> Summary Complete</>
                    ) : (
                        <><Sparkles size={16} /> Generate Summary</>
                    )}
                </button>
                <button
                    disabled={!textContent.trim() || isAnalyzing}
                    className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-white border border-[var(--color-brand-start)] text-[var(--color-brand-start)] font-medium text-[14px] hover:bg-[#ECFDF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Simplify Language
                </button>
                <button
                    disabled={!textContent.trim() || isAnalyzing}
                    className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-white border border-[var(--color-brand-start)] text-[var(--color-brand-start)] font-medium text-[14px] hover:bg-[#ECFDF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Extract Tasks
                </button>
            </div>
        </div>
    );
}
