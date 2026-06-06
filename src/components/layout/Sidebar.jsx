import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    FileText,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import BrandMark from '../common/BrandMark';
import { clearAuth } from '../../api/client';

const mainMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'summarizer', name: 'Summarizer', icon: FileText },
];

const generalMenuItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'help', name: 'Help', icon: HelpCircle },
    { id: 'logout', name: 'Logout', icon: LogOut },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveView = () => {
        const path = location.pathname;
        if (path.includes('/dashboard/tasks')) return 'tasks';
        if (path.includes('/dashboard/summarizer')) return 'summarizer';
        if (path.includes('/dashboard/settings')) return 'settings';
        return 'dashboard';
    };

    const activeView = getActiveView();

    const handleLogout = (e) => {
        e.preventDefault();
        clearAuth();
        navigate("/login");
    };

    return (
        <aside className="w-[192px] bg-white h-screen flex flex-col border-r border-[var(--color-border-color)] pb-5 shrink-0 transition-all duration-300 sticky top-0 z-20 shadow-[var(--shadow-card)]">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-6">
                <BrandMark size={32} />
                <span className="font-bold text-xl text-[var(--color-text-primary)] tracking-tight">NeuroSync</span>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Menu Section */}
                <div className="mb-6">
                    <p className="px-5 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Menu</p>
                    <ul className="space-y-1">
                        {mainMenuItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.id === 'dashboard') {
                                                navigate('/dashboard');
                                            } else {
                                                navigate(`/dashboard/${item.id}`);
                                            }
                                        }}
                                        className={`flex items-center justify-between py-2.5 px-5 transition-all duration-200 ${isActive
                                            ? 'bg-[var(--color-success-bg)] text-[var(--color-brand-end)] border-l-4 border-[var(--color-brand-end)]'
                                            : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 font-medium text-[14px]">
                                            <item.icon size={18} className={isActive ? 'text-[var(--color-brand-end)]' : 'text-[var(--color-text-muted)]'} strokeWidth={2} />
                                            {item.name}
                                        </div>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* General Section */}
                <div>
                    <p className="px-5 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">General</p>
                    <ul className="space-y-1">
                        {generalMenuItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.id === 'logout') {
                                                handleLogout(e);
                                            } else if (item.id === 'help') {
                                                navigate('/dashboard/settings');
                                            } else {
                                                navigate(`/dashboard/${item.id}`);
                                            }
                                        }}
                                        className={`flex items-center gap-3 py-2.5 px-5 text-[14px] font-medium transition-all duration-200 ${isActive
                                            ? 'bg-[var(--color-success-bg)] text-[var(--color-brand-end)] border-l-4 border-[var(--color-brand-end)]'
                                            : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <item.icon size={18} className={isActive ? 'text-[var(--color-brand-end)]' : 'text-[var(--color-text-muted)]'} strokeWidth={2} />
                                        {item.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
