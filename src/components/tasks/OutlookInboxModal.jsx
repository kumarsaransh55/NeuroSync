import React, { useState } from 'react';
import { X, Mail, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { isOutlookConfigured, fetchOutlookMessages } from '../../services/outlook';

// Representative messages used when a Microsoft 365 app registration isn't
// configured yet (see docs/OUTLOOK-INTEGRATION.md). The Q3 email matches the
// demo script so the email→task flow is consistent.
const DEMO_EMAILS = [
    {
        id: 1,
        sender: 'Rahul Mehta',
        subject: 'Re: Q3 client deck + a couple of things',
        body: 'Hi Aanya, thanks for jumping on the TechCorp account. Following the call, a few things need to move. We should get the revised pricing into the deck — finance flagged the old numbers. It would also be good to loop in Priya on the implementation timeline before we share anything externally, and someone needs to confirm whether legal signed off on the new contract terms. The client wants to see something by end of week, so let’s aim to have the deck ready for review on Thursday.',
        time: '9:02 AM'
    },
    {
        id: 2,
        sender: 'Priya Nair',
        subject: 'Onboarding checklist for the new analyst',
        body: 'Please set up the new joiner: request laptop access, share the Q3 folder, book a 30-minute intro call, and add them to the TechCorp distribution list. Try to wrap this up before Friday.',
        time: 'Yesterday'
    },
    {
        id: 3,
        sender: 'IT Service Desk',
        subject: 'Action required: password reset',
        body: 'Your network password expires in 3 days. Reset it via the self-service portal to avoid being locked out. This only takes about 5 minutes.',
        time: 'Mon'
    }
];

export default function OutlookInboxModal({ isOpen, onClose, onAddTask }) {
    const [emails, setEmails] = useState(DEMO_EMAILS);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const configured = isOutlookConfigured();

    const connect = async () => {
        setLoading(true);
        setError('');
        try {
            const msgs = await fetchOutlookMessages(8);
            setEmails(msgs.length ? msgs : DEMO_EMAILS);
            setConnected(true);
        } catch (e) {
            setError(e.message || 'Could not connect to Outlook.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F3F8FD]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#0F6CBD] flex items-center justify-center text-white">
                            <Mail size={16} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Outlook</h2>
                            <p className="text-[11px] text-gray-500 leading-tight">Inbox · pick an email to turn into a task</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {configured && (
                            <button
                                onClick={connect}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F6CBD] hover:bg-[#0c5aa0] text-white text-[12px] font-medium rounded-lg transition-colors disabled:opacity-60"
                            >
                                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                                {loading ? 'Connecting…' : connected ? 'Refresh' : 'Connect Outlook'}
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1" aria-label="Close Outlook inbox">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="px-6 py-3 flex items-start gap-2 bg-red-50 text-red-700 text-[13px] border-b border-red-100">
                        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Email List */}
                <div className="overflow-y-auto flex-1 p-2">
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            className="p-4 border-b border-gray-50 hover:bg-[#F3F8FD] transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-900 truncate">{email.sender}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{email.time}</span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-800 truncate mb-1">{email.subject}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{email.body}</p>
                            </div>

                            <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                    onClick={() => onAddTask(email)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-start)] hover:bg-[var(--color-brand-mid)] text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                                >
                                    <Plus size={16} />
                                    Break into task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <span>{connected ? 'Connected to Outlook (Microsoft Graph)' : 'Connected as aanya.sharma@accenture.com'}</span>
                    <span className="text-[#0F6CBD]">{configured ? (connected ? 'Live' : 'Click Connect to load your inbox') : 'Microsoft 365 (demo)'}</span>
                </div>

            </div>
        </div>
    );
}
