import React, { useState } from 'react';
import { Search, Mail, Bell } from 'lucide-react';
import OverwhelmedButton from './overwhelmed/OverwhelmedButton';
import OverwhelmedModal from './overwhelmed/OverwhelmedModal';

export default function Header({ focusMode, setFocusMode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="h-[88px] px-8 flex items-center justify-between border-b border-[var(--color-border-color)] bg-[var(--color-bg-light)]">

            {/* Search Bar & Overwhelmed Button */}
            <div className="flex items-center gap-6 w-full max-w-2xl">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-[var(--color-text-muted)]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search task"
                        className="block w-full pl-10 pr-12 py-2.5 border border-transparent rounded-full leading-5 bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:bg-white focus:border-[var(--color-brand-start)] focus:ring-1 focus:ring-[var(--color-brand-start)] sm:text-sm shadow-sm transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)] border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">⌘F</span>
                    </div>
                </div>

                {/* Overwhelmed Button */}
                <OverwhelmedButton onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white border border-[var(--color-border-color)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-start)] hover:border-[var(--color-brand-start)] transition-colors shadow-sm">
                        <Mail size={18} />
                    </button>
                    <button className="relative w-10 h-10 rounded-full bg-white border border-[var(--color-border-color)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-start)] hover:border-[var(--color-brand-start)] transition-colors shadow-sm">
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 cursor-pointer select-none">
                    <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User avatar"
                    />
                    <div className="hidden md:block">
                        <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Totok Michael</p>
                        <p className="text-[12px] text-[var(--color-text-muted)]">tmichael20@mail.com</p>
                    </div>
                </div>

            </div>

            {/* Overwhelmed Modal Portal */}
            <OverwhelmedModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setFocusMode={setFocusMode}
            />

        </header>
    );
}
