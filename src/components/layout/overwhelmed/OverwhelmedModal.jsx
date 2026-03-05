import React, { useEffect, useState } from 'react';
import BreathingGuide from './BreathingGuide';
import QuickActionGrid from './QuickActionGrid';
import BreathingAnimation from './BreathingAnimation';

export default function OverwhelmedModal({ isOpen, onClose, setFocusMode }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setShowBreathing(false); // Reset on open
        } else {
            setTimeout(() => setIsAnimating(false), 250); // match fade out duration
        }
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen && !isAnimating) return null;

    const handleAction = (action) => {
        console.log(`Action triggered: ${action}`);
        if (action === 'focus') {
            setFocusMode(true);
            onClose();
        } else if (action === 'breathe') {
            setShowBreathing(true);
        } else {
            // handle task or timer if needed
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto sm:p-4">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-250 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="overwhelmed-title"
                className={`relative w-full sm:w-[90%] md:w-[480px] bg-white rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] mt-auto sm:mt-0 max-h-[90vh] overflow-y-auto transform transition-all duration-250 ease-out origin-bottom sm:origin-center
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 sm:translate-y-0'}`}
            >

                {/* Close Button (Hidden on strict mobile, but good for accessibility) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close dialog"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <div className="text-5xl mb-4 leading-none">🧘</div>
                    <h2 id="overwhelmed-title" className="text-[22px] font-semibold text-[var(--color-text-primary)] tracking-tight">
                        Take a short pause
                    </h2>
                    <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
                        It's okay to feel overwhelmed.<br />Let's reset your mind for a moment.
                    </p>
                </div>

                {showBreathing ? (
                    <BreathingAnimation onComplete={() => setShowBreathing(false)} />
                ) : (
                    <BreathingGuide />
                )}

                <QuickActionGrid onAction={handleAction} />

            </div>
        </div>
    );
}
