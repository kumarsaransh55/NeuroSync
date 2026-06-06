import React, { useState } from 'react';
import { Search, Mail, Bell } from 'lucide-react';
import OverwhelmedButton from './overwhelmed/OverwhelmedButton';
import OverwhelmedModal from './overwhelmed/OverwhelmedModal';
import { getUser } from '../../api/client';

export default function Header({ focusMode, setFocusMode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = getUser() || {};
    const name = user.name || 'NeuroSync User';
    const email = user.email || '';
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0F3D2E&color=fff&bold=true`;

    return (
        <header className="h-16 px-6 flex items-center justify-between border-b border-[var(--color-border-color)] bg-[var(--color-bg-light)]">

            {/* Search Bar & Overwhelmed Button */}
            <div className="flex items-center gap-4 w-full max-w-2xl">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-[var(--color-text-muted)]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search task"
                        aria-label="Search tasks"
                        className="block w-full pl-10 pr-12 py-2 border border-transparent rounded-full leading-5 bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:bg-white focus:border-[var(--color-brand-start)] focus:ring-1 focus:ring-[var(--color-brand-start)] sm:text-sm shadow-sm transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)] border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">⌘F</span>
                    </div>
                </div>

                {/* Overwhelmed Button */}
                <OverwhelmedButton onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">

                {/* Icons */}
                <div className="flex items-center gap-3">
                    <button aria-label="Messages" className="w-9 h-9 rounded-full bg-white border border-[var(--color-border-color)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-start)] hover:border-[var(--color-brand-start)] transition-colors shadow-sm">
                        <Mail size={18} />
                    </button>
                    <button aria-label="Notifications" className="relative w-9 h-9 rounded-full bg-white border border-[var(--color-border-color)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-brand-start)] hover:border-[var(--color-brand-start)] transition-colors shadow-sm">
                        <Bell size={18} />
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 cursor-pointer select-none">
                    <img
                        className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                        src={avatar}
                        alt={name}
                    />
                    <div className="hidden md:block">
                        <p className="text-[14px] font-semibold text-[var(--color-text-primary)] leading-tight">{name}</p>
                        {email && <p className="text-[12px] text-[var(--color-text-muted)] leading-tight">{email}</p>}
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
