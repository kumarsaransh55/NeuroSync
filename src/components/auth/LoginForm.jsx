import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../api/client';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        try {
            const data = await api.login(email, password);
            // Backend returns the JWT in the body so this SPA can store it and
            // send it as an Authorization: Bearer header on later requests.
            if (data?.token) setToken(data.token);
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } catch (error) {
            setErrorMsg(error.message || 'Could not log in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 mb-2">
                        {errorMsg}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[44px] px-3 border border-gray-200 rounded-xl font-['Inter'] placeholder-[#9CA3AF] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all text-[14px] shadow-sm"
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[44px] px-3 border border-gray-200 rounded-xl font-['Inter'] placeholder-[#9CA3AF] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all text-[14px] shadow-sm"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-between mt-1 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#166534] focus:ring-[#166534]" />
                        <span className="text-[14px] text-gray-600">Remember Me</span>
                    </label>
                    <a href="#" className="text-[14px] text-[#166534] hover:underline font-medium">
                        Forgot Password
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-[44px] bg-gradient-to-r from-[#14532D] to-[#166534] text-white rounded-xl font-semibold text-[14px] shadow-[0_6px_12px_rgba(22,101,52,0.2)] hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="text-center mt-6 mb-2">
                <span className="text-[14px] text-gray-600">Don't have an account? </span>
                <span
                    onClick={() => navigate('/register')}
                    className="text-[14px] text-[#166534] hover:underline font-medium cursor-pointer"
                >
                    Sign up now
                </span>
            </div>

            <div className="mt-4">
                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 px-4 text-[13px] text-gray-500 bg-white">Or continue with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button type="button" className="flex items-center justify-center gap-2 h-[44px] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-[14px] font-medium text-gray-700">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 h-[44px] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 21 21"><path fill="#f25022" d="M1 1h9v9H1z" /><path fill="#00a4ef" d="M1 11h9v9H1z" /><path fill="#7fba00" d="M11 1h9v9h-9z" /><path fill="#ffb900" d="M11 11h9v9h-9z" /></svg>
                        <span className="text-[14px] font-medium text-gray-700">Microsoft</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
