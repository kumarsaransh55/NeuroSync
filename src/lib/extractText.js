import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Extract plain text from an uploaded file. Handles PDF (pdfjs), DOCX (mammoth),
// and plain text — so uploads no longer turn into gibberish.
export async function extractTextFromFile(file) {
    const name = (file.name || '').toLowerCase();

    if (name.endsWith('.pdf') || file.type === 'application/pdf') {
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((it) => it.str || '').join(' ') + '\n';
        }
        return text.trim();
    }

    if (name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        return (result.value || '').trim();
    }

    // .txt / .md / fallback
    return (await file.text()).trim();
}
