import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({
    children,
    title = "Dashboard",
    description = "Plan, prioritize, and accomplish your tasks with ease.",
    actions,
    activeView,
    onViewChange,
    focusMode,
    setFocusMode
}) {
    return (
        <div className="flex bg-[var(--color-bg-light)] min-h-screen font-sans text-[var(--color-text-primary)]">
            <Sidebar activeView={activeView} onViewChange={onViewChange} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header focusMode={focusMode} setFocusMode={setFocusMode} />

                <main className="p-8 flex-1 overflow-x-hidden overflow-y-auto w-full">
                    <div className="max-w-[1600px] mx-auto w-full">

                        {/* Dashboard Title & Actions */}
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h1>
                                <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">{description}</p>
                            </div>

                            <div className="flex gap-4">
                                {actions || (
                                    <>
                                        <button className="px-5 py-2.5 rounded-[var(--radius-btn)] border border-[var(--color-brand-start)] text-[var(--color-brand-start)] font-medium text-[14px] hover:bg-[var(--color-success-bg)] transition-colors">
                                            Import Data
                                        </button>
                                        <button className="px-5 py-2.5 rounded-[var(--radius-btn)] bg-[var(--color-brand-start)] text-white font-medium text-[14px] flex items-center gap-2 hover:bg-[var(--color-brand-mid)] transition-colors shadow-sm">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Add Project
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        {children}

                    </div>
                </main>
            </div>
        </div>
    );
}
