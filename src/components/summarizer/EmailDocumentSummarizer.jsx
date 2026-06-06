import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputWorkspace from './InputWorkspace';
import SummaryCard from './cards/SummaryCard';
import ActionItemsCard from './cards/ActionItemsCard';
import DeadlineCard from './cards/DeadlineCard';
import ToneCard from './cards/ToneCard';
import HighlightsCard from './cards/HighlightsCard';
import SimplifiedCard from './cards/SimplifiedCard';
import HiddenTasksCard from './cards/HiddenTasksCard';
import { FileText } from 'lucide-react';

export default function EmailDocumentSummarizer() {
    const [simplifyMode, setSimplifyMode] = useState(false);
    const [dyslexiaMode, setDyslexiaMode] = useState(false);

    // State to hold the result of the AI Analysis
    const [analysisResult, setAnalysisResult] = useState(null);
    const navigate = useNavigate();

    const handleAnalysisComplete = (resultData) => {
        setAnalysisResult(resultData);
    };

    // "Convert All to Tasks" → hand the action items to the Task Planner.
    const handleConvertAll = (items) => {
        if (!items || items.length === 0) return;
        const texts = items.map((i) => i.text).filter(Boolean);
        localStorage.setItem('neurosync_pending_tasks', JSON.stringify(texts));
        navigate('/dashboard/tasks');
    };

    return (
        <div className={`w-full ${dyslexiaMode ? 'font-dyslexia' : ''}`}>
            {/* Accessibility Toggles */}
            <div className="flex justify-end items-center gap-6 mb-6 px-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={simplifyMode}
                            onChange={(e) => setSimplifyMode(e.target.checked)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${simplifyMode ? 'bg-[var(--color-accent)]' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${simplifyMode ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">Simplify Mode</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={dyslexiaMode}
                            onChange={(e) => setDyslexiaMode(e.target.checked)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${dyslexiaMode ? 'bg-[var(--color-accent)]' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${dyslexiaMode ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">Dyslexia Mode</span>
                </label>
            </div>

            {/* Split Workspace Layout */}
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${simplifyMode ? 'gap-8' : ''}`}>

                {/* Left Panel - Input Workspace (5 columns) */}
                <div className="col-span-1 md:col-span-12 xl:col-span-5 flex flex-col gap-6">
                    <InputWorkspace onAnalyzeComplete={handleAnalysisComplete} />
                </div>

                {/* Right Panel - AI Output (7 columns) */}
                <div className="col-span-1 md:col-span-12 xl:col-span-7 flex flex-col gap-5">
                    {!analysisResult ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-gray-200 rounded-[var(--radius-card)] bg-gray-50/50 text-gray-400">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <FileText size={28} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Waiting for Content</h3>
                            <p className="text-sm max-w-[280px] text-center">Paste text or upload a document on the left, then click Generate Summary to see AI insights here.</p>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <SummaryCard data={analysisResult.summary} />
                            <ActionItemsCard data={analysisResult.actionItems} onConvertAll={handleConvertAll} />
                            <DeadlineCard data={analysisResult.deadlines} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <ToneCard data={analysisResult.tone} />
                                <HiddenTasksCard data={analysisResult.hiddenTasks} />
                            </div>

                            <HighlightsCard data={analysisResult.highlights} />
                            <SimplifiedCard simplifyMode={simplifyMode} data={analysisResult.simplified} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
