import React, { useState, useEffect } from 'react';

export default function BreathingAnimation({ duration = 30, onComplete }) {
    const [phase, setPhase] = useState('Inhale');
    // Start the circle small so the very first "Inhale" visibly expands,
    // instead of mounting already-expanded (which is why it only animated on exhale).
    const [primed, setPrimed] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(duration);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onComplete();
            return;
        }
        const timer = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft, onComplete]);

    useEffect(() => {
        let cycleTimeout;
        // Paint small first, then prime + start so the first inhale animates outward.
        const primeTimeout = setTimeout(() => setPrimed(true), 80);

        const runCycle = () => {
            setPhase('Inhale');
            cycleTimeout = setTimeout(() => {
                setPhase('Hold');
                cycleTimeout = setTimeout(() => {
                    setPhase('Exhale');
                    cycleTimeout = setTimeout(runCycle, 6000); // Exhale for 6s
                }, 4000); // Hold for 4s
            }, 4000); // Inhale for 4s
        };
        const startTimeout = setTimeout(runCycle, 100);

        return () => {
            clearTimeout(primeTimeout);
            clearTimeout(startTimeout);
            clearTimeout(cycleTimeout);
        };
    }, []);

    // Determine scale for animation
    const getScaleClass = () => {
        if (!primed) return 'scale-100 transition-transform duration-[4000ms] ease-in-out';
        switch (phase) {
            case 'Inhale': return 'scale-150 transition-transform duration-[4000ms] ease-in-out';
            case 'Hold': return 'scale-150 transition-none';
            case 'Exhale': return 'scale-100 transition-transform duration-[6000ms] ease-in-out';
            default: return 'scale-100';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#F0FDF4] rounded-xl border border-[#22C55E] mb-6 min-h-[200px]">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                <div className={`absolute inset-0 bg-[#22C55E] opacity-20 rounded-full ${getScaleClass()}`}></div>
                <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#22C55E]">
                    <span className="font-bold text-[18px] text-[var(--color-brand-start)]">{phase}</span>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">
                    Follow the expanding circle
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
                    {secondsLeft}s remaining
                </p>
            </div>
        </div>
    );
}
