import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (!email || !password || !fullName) {
            setErrorMsg("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("https://neurosync.azurewebsites.net/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    fullName: fullName,
                    password: password
                })
            });

            if (response.ok) {
                // Success logic
                setSuccessMsg("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Error handling (e.g. Email exists, Weak Password, etc.)
                let errText = "Registration failed. Please try again.";
                try {
                    const errorObj = await response.json();
                    if (errorObj && errorObj.message) errText = errorObj.message;
                    // Sometimes .NET identity returns errors array
                    if (errorObj && errorObj.errors) {
                        const firstKey = Object.keys(errorObj.errors)[0];
                        if (firstKey) errText = errorObj.errors[firstKey][0];
                    }
                } catch (jsonError) {
                    console.log("Could not parse error JSON", jsonError);
                }

                setErrorMsg(errText);
            }
        } catch (networkError) {
            console.error("Network Error:", networkError);
            setErrorMsg("Network error. Could not connect to the server.");
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

                {successMsg && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-200 mb-2 font-medium">
                        {successMsg}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-[44px] px-3 border border-gray-200 rounded-xl font-['Inter'] placeholder-[#9CA3AF] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all text-[14px] shadow-sm"
                        placeholder="John Doe"
                        required
                        disabled={isLoading || successMsg}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[44px] px-3 border border-gray-200 rounded-xl font-['Inter'] placeholder-[#9CA3AF] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all text-[14px] shadow-sm"
                        placeholder="you@example.com"
                        required
                        disabled={isLoading || successMsg}
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
                        disabled={isLoading || successMsg}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || successMsg}
                    className="h-[44px] mt-4 bg-gradient-to-r from-[#14532D] to-[#166534] text-white rounded-xl font-semibold text-[14px] shadow-[0_6px_12px_rgba(22,101,52,0.2)] hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="text-center mt-6">
                <span className="text-[14px] text-gray-600">Already have an account? </span>
                <span
                    onClick={() => navigate('/login')}
                    className="text-[14px] text-[#166534] hover:underline font-medium cursor-pointer"
                >
                    Sign in here
                </span>
            </div>
        </div>
    );
}
