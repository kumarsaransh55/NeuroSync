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
import ProfileCompareModal from './ProfileCompareModal';
import { FileText, Users } from 'lucide-react';
import { api } from '../../api/client';
import { useTasks } from '../../context/TasksContext';

// Remove a "(… time …)" estimate from an action item before it becomes a task
// heading, e.g. "Reply to Rahul (Est. time: 15 min)" → "Reply to Rahul". Matches a
// single bracket pair that mentions the word "time" (case-insensitive) or a
// duration like "15 min" / "2 hrs", and strips the whole bracket + its contents.
// On the Tasks page each step gets its time estimated separately, so the heading
// should carry the action only (the summarizer page still shows the full text).
const stripTimeEstimate = (s = '') => s
    .replace(/\s*\([^()]*(?:\btime\b|\d+\s*(?:-\s*\d+\s*)?(?:min(?:ute)?s?|h(?:ou)?rs?))[^()]*\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

export default function EmailDocumentSummarizer() {
    const [dyslexiaMode, setDyslexiaMode] = useState(false);
    // Restore the last analysis so leaving the page (e.g. to change Settings) and
    // coming back keeps the result on screen.
    const [analysisResult, setAnalysisResult] = useState(() => {
        try { const r = localStorage.getItem('ns_summarizer_result'); return r ? JSON.parse(r) : null; }
        catch { return null; }
    });
    const [converting, setConverting] = useState(false);
    const [compareOpen, setCompareOpen] = useState(false);
    const navigate = useNavigate();
    const { importTaskFromServer, setTasks, currentProjectId } = useTasks();

    const handleAnalysisComplete = (resultData) => {
        setAnalysisResult(resultData);
        try { localStorage.setItem('ns_summarizer_result', JSON.stringify(resultData)); } catch { /* ignore */ }
    };

    // "Convert all to tasks" → ONE task: the AI names the overall task and writes a
    // context-aware description for each action item (which become the subtasks).
    const handleConvertAll = async (items) => {
        if (!items || items.length === 0) return;
        const actionItems = items.map((i) => stripTimeEstimate(i.text)).filter(Boolean);
        const source = analysisResult?.sourceText || '';
        setConverting(true);
        try {
            const task = await api.createTaskFromActions(source, actionItems, null);
            importTaskFromServer(task);
        } catch {
            // Fallback (e.g. AI busy): one local task with the action items as steps.
            setTasks((prev) => [{
                id: `local_${Date.now()}`,
                name: 'Tasks from summary',
                description: '',
                completed: false,
                dueDate: 'Today',
                relatedTo: 'From Summarizer',
                projectId: currentProjectId || null,
                assignee: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=random' },
                tags: [{ label: 'email', type: 'category' }],
                steps: actionItems.map((a, i) => ({ id: `s_${Date.now()}_${i}`, text: a, description: '', completed: false, estMinutes: 10 })),
            }, ...prev]);
        } finally {
            setConverting(false);
            navigate('/dashboard/tasks');
        }
    };

    return (
        <div className={`w-full ${dyslexiaMode ? 'font-dyslexia' : ''}`}>
            {/* Accessibility Toggle */}
            <div className="flex justify-end items-center gap-6 -mt-2 mb-3 px-2">
                {analysisResult && (
                    <button
                        onClick={() => setCompareOpen(true)}
                        className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-brand-start)] border border-[var(--color-brand-start)] rounded-[var(--radius-btn)] px-3 py-1.5 hover:bg-[var(--color-success-bg)] transition-colors"
                    >
                        <Users size={15} /> Compare profiles
                    </button>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Panel - Input Workspace */}
                <div className="col-span-1 md:col-span-12 xl:col-span-5 flex flex-col gap-6">
                    <InputWorkspace onAnalyzeComplete={handleAnalysisComplete} />
                </div>

                {/* Right Panel - AI Output */}
                <div className="col-span-1 md:col-span-12 xl:col-span-7 flex flex-col gap-5">
                    {!analysisResult ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-gray-200 rounded-[var(--radius-card)] bg-gray-50/50 text-gray-400">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <FileText size={28} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Waiting for Content</h3>
                            <p className="text-sm max-w-[280px] text-center">Paste text or upload a document on the left, then click Analyze to see AI insights here.</p>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <SummaryCard data={analysisResult.summary} />
                            <ActionItemsCard data={analysisResult.actionItems} onConvertAll={handleConvertAll} converting={converting} />
                            <DeadlineCard data={analysisResult.deadlines} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                                <ToneCard data={analysisResult.tone} />
                                <HiddenTasksCard data={analysisResult.hiddenTasks} />
                            </div>

                            <HighlightsCard data={analysisResult.highlights} />
                            <SimplifiedCard data={analysisResult.simplified} />
                        </div>
                    )}
                </div>

            </div>

            <ProfileCompareModal
                isOpen={compareOpen}
                onClose={() => setCompareOpen(false)}
                sourceText={analysisResult?.sourceText || ''}
            />
        </div>
    );
}
