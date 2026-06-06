import { Waypoints } from 'lucide-react';

// NeuroSync brand mark: connected nodes = bringing scattered work into sync
// with how each person thinks. Replaces the old generic circle.
export default function BrandMark({ size = 32, className = '' }) {
    const inner = Math.round(size * 0.56);
    return (
        <div
            className={`rounded-xl bg-gradient-to-br from-[var(--color-brand-start)] to-[var(--color-brand-end)] flex items-center justify-center shadow-sm ${className}`}
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            <Waypoints size={inner} className="text-white" strokeWidth={2.25} />
        </div>
    );
}
