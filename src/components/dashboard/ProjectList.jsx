import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'Develop API Endpoints',
        date: 'Due date: Nov 26, 2024',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: 2,
        title: 'Onboarding Flow',
        date: 'Due date: Nov 28, 2024',
        iconColor: 'text-teal-500',
        iconBg: 'bg-teal-50',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 3,
        title: 'Build Dashboard',
        date: 'Due date: Nov 30, 2024',
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9H21M9 21V9" stroke="currentColor" strokeWidth="2" />
            </svg>
        )
    },
    {
        id: 4,
        title: 'Optimize Page Load',
        date: 'Due date: Dec 5, 2024',
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-50',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: 5,
        title: 'Cross-Browser Testing',
        date: 'Due date: Dec 6, 2024',
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 21H16M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }
];

export default function ProjectList() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 shadow-sm border border-[var(--color-border-color)] h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Project</h3>
                <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-[var(--color-text-primary)] text-[12px] font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-white transition-colors">
                    <MoreHorizontal size={14} /> New
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                {projects.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 py-1 hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${project.iconBg} ${project.iconColor} group-hover:scale-110 transition-transform`}>
                            {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate transition-colors group-hover:text-[var(--color-brand-start)]">{project.title}</h4>
                            <p className="text-[12px] text-[var(--color-text-muted)] truncate mt-0.5">{project.date}</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}
