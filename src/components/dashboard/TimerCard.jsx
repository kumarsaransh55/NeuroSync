import React, { useState, useEffect } from 'react';
import { Pause, Square, Play } from 'lucide-react';

export default function TimerCard() {
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(5048); // 01:24:08 in seconds

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative rounded-[var(--radius-card)] p-6 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] flex flex-col h-full bg-[var(--color-brand-start)] group">

            {/* Decorative Wavy Background - SVG abstract */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="url(#grad1)" />
                    <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="url(#grad2)" />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-brand-end)" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-brand-mid)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <h3 className="text-[16px] font-semibold text-white/90 relative z-10">Time Tracker</h3>

            <div className="flex-1 flex flex-col items-center justify-center gap-6 relative z-10 mt-6 mb-2">
                <div className="text-[42px] font-bold text-white tracking-widest font-mono drop-shadow-md">
                    {formatTime(time)}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="w-12 h-12 rounded-full bg-white text-[var(--color-brand-start)] flex items-center justify-center hover:bg-gray-100 transition-all shadow-md hover:scale-105"
                    >
                        {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                        onClick={() => { setIsRunning(false); setTime(0); }}
                        className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-md hover:scale-105"
                    >
                        <Square size={16} fill="currentColor" />
                    </button>
                </div>
            </div>

        </div>
    );
}
