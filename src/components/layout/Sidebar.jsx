import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    FileText,
    BarChart2,
    Users,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';

const mainMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare, badge: '12+' },
    { id: 'summarizer', name: 'Summarizer', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart2 },
    { id: 'team', name: 'Team', icon: Users },
];

const generalMenuItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'help', name: 'Help', icon: HelpCircle },
    { id: 'logout', name: 'Logout', icon: LogOut },
];

export default function Sidebar({ activeView = 'dashboard', onViewChange }) {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
    };

    return (
        <aside className="w-[240px] bg-white h-screen flex flex-col border-r border-[var(--color-border-color)] pb-6 shrink-0 transition-all duration-300 sticky top-0 z-20 shadow-[var(--shadow-card)]">
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-start)] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" fill="white" />
                    </svg>
                </div>
                <span className="font-bold text-xl text-[var(--color-text-primary)] tracking-tight">NeuroSync</span>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {/* Menu Section */}
                <div className="mb-6">
                    <p className="px-6 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Menu</p>
                    <ul className="space-y-1">
                        {mainMenuItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (onViewChange) onViewChange(item.id);
                                        }}
                                        className={`flex items-center justify-between py-3 px-6 transition-all duration-200 ${isActive
                                            ? 'bg-[var(--color-success-bg)] text-[var(--color-brand-end)] border-l-4 border-[var(--color-brand-end)]'
                                            : 'text-[var(--color-text-secondary)] hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 font-medium text-[14px]">
                                            <item.icon size={18} className={isActive ? 'text-[var(--color-brand-end)]' : 'text-[var(--color-text-muted)]'} strokeWidth={2} />
                                            {item.name}
                                        </div>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-brand-start)] text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* General Section */}
                <div>
                    <p className="px-6 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">General</p>
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
                                            } else if (onViewChange) {
                                                onViewChange(item.id);
                                            }
                                        }}
                                        className={`flex items-center gap-3 py-3 px-6 text-[14px] font-medium transition-all duration-200 ${isActive
                                            ? 'bg-[var(--color-success-bg)] text-[var(--color-brand-end)] border-l-4 border-[var(--color-brand-end)]'
                                            : 'text-[var(--color-text-secondary)] hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
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
