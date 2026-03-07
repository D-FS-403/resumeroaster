export interface RoastResult {
  overallScore: number;
  grade: string;
  roastHeadline: string;
  badges: string[];
  categories: CategoryScore[];
}

export interface CategoryScore {
  name: string;
  score: number;
  grade: string;
  roastLine: string;
  tip: string;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction is only available in the browser');
  }

  const pdfjsLib = await import('pdfjs-dist');
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}
