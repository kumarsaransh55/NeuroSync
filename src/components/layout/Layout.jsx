import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ResetTimerChip from './ResetTimerChip';
import ReminderToast from './ReminderToast';
import OnboardingModal from './OnboardingModal';
import FocusSession from '../focus/FocusSession';

export default function Layout({
    children,
    title = "Dashboard",
    description = "Plan, prioritize, and accomplish your tasks with ease.",
    actions,
    focusMode,
    setFocusMode
}) {
    const navigate = useNavigate();
    return (
        <div className="flex bg-[var(--color-bg-light)] min-h-screen font-sans text-[var(--color-text-primary)]">
            {/* Skip link: first focusable element, visible only when focused (keyboard users) */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-brand-start)] focus:text-white focus:shadow-lg"
            >
                Skip to main content
            </a>
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header focusMode={focusMode} setFocusMode={setFocusMode} />

                <main id="main-content" tabIndex={-1} className="px-6 py-5 flex-1 overflow-x-hidden overflow-y-auto w-full">
                    <div className="max-w-[1600px] mx-auto w-full">

                        {/* Dashboard Title & Actions */}
                        <div className="flex justify-between items-end mb-5">
                            <div>
                                <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h1>
                                <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">{description}</p>
                            </div>

                            <div className="flex gap-4">
                                {actions || (
                                    <button
                                        onClick={() => navigate('/dashboard/tasks')}
                                        className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] flex items-center gap-2 hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add Project
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        {children}

                    </div>
                </main>
            </div>
            <ResetTimerChip />
            <ReminderToast />
            <OnboardingModal />
            <FocusSession />
        </div>
    );
}
