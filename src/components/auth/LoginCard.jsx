import React from 'react';
import LoginForm from './LoginForm';

export default function LoginCard() {
    return (
        <div className="w-full md:w-[420px] bg-white rounded-2xl p-5 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-200 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-shadow duration-300 mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-start,#14532D)] to-[var(--color-brand-end,#166534)] flex items-center justify-center mb-4 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" fill="white" />
                    </svg>
                </div>
                <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">NeuroSync AI</h1>
                <p className="text-[14px] text-gray-500 mt-1">AI Productivity Assistant</p>
            </div>

            <LoginForm />
        </div>
    );
}
