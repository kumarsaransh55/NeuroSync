import React from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function UploadZone() {
    return (
        <div className="w-full border-2 border-dashed border-[#D1FAE5] rounded-[var(--radius-card)] p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-colors hover:bg-[#ECFDF5] group">
            <div className="w-12 h-12 mb-3 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[var(--color-accent)] group-hover:scale-110 transition-transform">
                <UploadCloud size={24} strokeWidth={2} />
            </div>
            <p className="font-medium text-[var(--color-text-primary)] text-[15px] mb-1">
                Drop file here or click to upload
            </p>
            <p className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-2">
                <FileText size={14} /> Supported formats: PDF, DOCX, TXT
            </p>
        </div>
    );
}
