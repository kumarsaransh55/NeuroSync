import React from 'react';
import ReactMarkdown from 'react-markdown';

// Render the AI's dyslexia-friendly rewrite. It comes back as Markdown
// (headings, bullets, bold), so we render it properly instead of showing raw "###".
const md = {
    h1: ({ node, ...p }) => <h4 className="text-[16px] font-bold text-[var(--color-text-primary)] mt-3 mb-1" {...p} />,
    h2: ({ node, ...p }) => <h4 className="text-[15px] font-bold text-[var(--color-text-primary)] mt-3 mb-1" {...p} />,
    h3: ({ node, ...p }) => <h5 className="text-[14px] font-bold text-[var(--color-text-primary)] mt-2 mb-1" {...p} />,
    p: ({ node, ...p }) => <p className="mb-2 leading-relaxed" {...p} />,
    ul: ({ node, ...p }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...p} />,
    ol: ({ node, ...p }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...p} />,
    li: ({ node, ...p }) => <li className="leading-relaxed" {...p} />,
    strong: ({ node, ...p }) => <strong className="font-semibold text-[var(--color-text-primary)]" {...p} />,
};

export default function SimplifiedCard({ data }) {
    const hasData = data && String(data).trim().length > 0;

    return (
        <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border-color)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Simplified Language</h3>

            {!hasData ? (
                <p className="text-[14px] text-[var(--color-text-muted)] italic">Not available.</p>
            ) : (
                <div className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
                    <ReactMarkdown components={md}>{String(data)}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}
