import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Set up PDF.js worker to use local copy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Create a document with the array buffer
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            try {
                const page = await pdf.getPage(i);
                const textContent_ = await page.getTextContent();

                textContent += textContent_.items
                    .map((item: any) => {
                        if (typeof item.str === 'string') {
                            return item.str;
                        }
                        return '';
                    })
                    .join('');
                textContent += '\n\n';
            } catch (pageError) {
                console.warn(`Warning: Could not extract text from page ${i}:`, pageError);
            }
        }

        return textContent.trim() || 'PDF loaded but no text could be extracted';
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        // Provide a more helpful error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to extract text from PDF: ${errorMessage}`);
    }
}

export async function extractTextFromDOCX(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        console.error('Error extracting DOCX text:', error);
        throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function extractTextFromTXT(file: File): Promise<string> {
    try {
        const text = await file.text();
        return text;
    } catch (error) {
        console.error('Error extracting TXT text:', error);
        throw new Error(`Failed to extract text from TXT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
