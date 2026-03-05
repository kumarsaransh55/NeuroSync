import React, { useState } from 'react';
import InputWorkspace from './InputWorkspace';
import SummaryCard from './cards/SummaryCard';
import ActionItemsCard from './cards/ActionItemsCard';
import DeadlineCard from './cards/DeadlineCard';
import ToneCard from './cards/ToneCard';
import HighlightsCard from './cards/HighlightsCard';
import SimplifiedCard from './cards/SimplifiedCard';
import HiddenTasksCard from './cards/HiddenTasksCard';

export default function EmailDocumentSummarizer() {
    const [simplifyMode, setSimplifyMode] = useState(false);
    const [dyslexiaMode, setDyslexiaMode] = useState(false);

    return (
        <div className={`w-full ${dyslexiaMode ? 'font-dyslexic' : ''}`}>
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
                    <InputWorkspace />
                </div>

                {/* Right Panel - AI Output (7 columns) */}
                <div className="col-span-1 md:col-span-12 xl:col-span-7 flex flex-col gap-5">
                    <SummaryCard />
                    <ActionItemsCard />
                    <DeadlineCard />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <ToneCard />
                        <HiddenTasksCard />
                    </div>

                    <HighlightsCard />
                    <SimplifiedCard simplifyMode={simplifyMode} />
                </div>

            </div>
        </div>
    );
}
