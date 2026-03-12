import React from 'react';
import { X, Mail, Plus } from 'lucide-react';

const MOCK_EMAILS = [
    {
        id: 1,
        sender: 'Sarah Jenkins',
        subject: 'Q3 Marketing Campaign Review',
        body: 'Please review the draft sent for the Q3 campaign. Pay special attention to the budget allocations for social media and the new graphic assets. Need feedback by EOD.',
        time: '10:30 AM'
    },
    {
        id: 2,
        sender: 'Alex Chen',
        subject: 'Client Presentation Slides',
        body: 'Can you finish the slides for the Acme Corp presentation? We need them by tomorrow morning. Make sure to include the new revenue projections.',
        time: 'Yesterday'
    },
    {
        id: 3,
        sender: 'System Alert',
        subject: 'Server Maintenance Scheduled',
        body: 'Routine server maintenance is scheduled for this Sunday at 2 AM EST. Please ensure all critical processes are paused.',
        time: 'Mar 10'
    }
];

export default function GmailInboxModal({ isOpen, onClose, onAddTask }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <Mail size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Gmail Inbox</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Email List */}
                <div className="overflow-y-auto flex-1 p-2">
                    {MOCK_EMAILS.map((email) => (
                        <div
                            key={email.id}
                            className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-900 truncate">{email.sender}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{email.time}</span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-800 truncate mb-1">{email.subject}</h3>
                                <p className="text-sm text-gray-500 truncate">{email.body}</p>
                            </div>

                            <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onAddTask(email)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-start)] hover:bg-[var(--color-brand-mid)] text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                >
                                    <Plus size={16} />
                                    Add as Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <span>Connected as user@example.com</span>
                    <button className="text-blue-600 hover:underline">Manage connection</button>
                </div>

            </div>
        </div>
    );
}
