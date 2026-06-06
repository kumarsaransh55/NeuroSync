import React from 'react';
import LoginForm from './LoginForm';
import BrandMark from '../common/BrandMark';

export default function LoginCard() {
    return (
        <div className="w-full md:w-[400px] bg-white rounded-2xl p-5 md:p-6 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-gray-200 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-shadow duration-300 mx-auto">
            <div className="flex flex-col items-center mb-5">
                <BrandMark size={44} className="mb-3" />
                <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">NeuroSync</h1>
                <p className="text-[13px] text-gray-500 mt-0.5">Work, in sync with how you think</p>
            </div>

            <LoginForm />
        </div>
    );
}
