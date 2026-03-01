import React from 'react';
import { Plus } from 'lucide-react';

const teamMembers = [
    {
        id: 1,
        name: 'Alexandra Deff',
        role: 'Working on Github Project Repository',
        status: 'Completed',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        statusColor: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]'
    },
    {
        id: 2,
        name: 'Edwin Adenike',
        role: 'Working on Integrate User Authentication System',
        status: 'In Progress',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        statusColor: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'
    },
    {
        id: 3,
        name: 'Isaac Oluwatemilorun',
        role: 'Working on Develop Search and Filter Functionality',
        status: 'Pending',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        statusColor: 'bg-[#FEE2E2] text-[#991B1B]' // Light red
    },
    {
        id: 4,
        name: 'David Oshodi',
        role: 'Working on Responsive Layout for Homepage',
        status: 'In Progress',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        statusColor: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'
    }
];

export default function TeamCard() {
    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] p-6 shadow-sm border border-[var(--color-border-color)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col h-full">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Team Collaboration</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border-color)] text-[12px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-success-bg)] hover:text-[var(--color-brand-start)] hover:border-[var(--color-brand-start)] transition-colors">
                    <Plus size={14} />
                    Add Member
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 py-2 hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors cursor-pointer">
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-[var(--color-border-color)] shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">{member.name}</h4>
                            <p className="text-[12px] text-[var(--color-text-muted)] truncate">{member.role}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${member.statusColor}`}>
                            {member.status}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}
