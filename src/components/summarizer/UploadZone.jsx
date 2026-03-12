import React, { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function UploadZone({ onFileSelect }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full border-2 border-dashed rounded-[var(--radius-card)] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group
                ${isDragging ? 'border-[var(--color-brand-start)] bg-[#ECFDF5]' : 'border-[#D1FAE5] bg-white hover:bg-[#ECFDF5]'}
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt"
            />
            <div className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-transform group-hover:scale-110
                ${isDragging ? 'bg-[var(--color-brand-start)] text-white' : 'bg-[#ECFDF5] text-[var(--color-accent)]'}
            `}>
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
