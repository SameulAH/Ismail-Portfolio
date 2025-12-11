/**
 * PDF Parser Utility
 * Extracts text content from PDF files for knowledge base ingestion
 */

import pdf from 'pdf-parse';

export interface PDFParseResult {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creationDate?: string;
  };
}

/**
 * Parse PDF buffer and extract text content
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      numPages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
        creationDate: data.info?.CreationDate,
      },
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters that might cause issues
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Trim
    .trim();
}

/**
 * Split text into semantic chunks for better vector search
 * Chunks by sections (headers, paragraphs) while respecting max length
 */
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const chunks: string[] = [];
  const cleanedText = cleanText(text);
  
  // Split by common section patterns
  const sectionPatterns = [
    /\n(?=[A-Z][A-Z\s]+\n)/g,  // ALL CAPS HEADERS
    /\n(?=#+\s)/g,             // Markdown headers
    /\n\n+/g,                  // Double newlines (paragraphs)
  ];
  
  let sections = [cleanedText];
  
  for (const pattern of sectionPatterns) {
    const newSections: string[] = [];
    for (const section of sections) {
      if (section.length <= maxChunkSize) {
        newSections.push(section);
      } else {
        const split = section.split(pattern).filter(s => s.trim());
        newSections.push(...split);
      }
    }
    sections = newSections;
  }
  
  // Further split any sections that are still too long
  for (const section of sections) {
    if (section.length <= maxChunkSize) {
      if (section.trim()) {
        chunks.push(section.trim());
      }
    } else {
      // Split by sentences
      const sentences = section.match(/[^.!?]+[.!?]+/g) || [section];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxChunkSize) {
          currentChunk += sentence;
        } else {
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sentence;
        }
      }
      
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
    }
  }
  
  return chunks;
}

/**
 * Extract structured information from CV text
 * Attempts to identify common CV sections
 */
export function extractCVSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const cleanedText = cleanText(text);
  
  // Common CV section headers
  const sectionPatterns: Record<string, RegExp> = {
    education: /(?:education|academic|qualifications?|degrees?)\s*[:\n]/i,
    experience: /(?:experience|employment|work\s*history|professional\s*experience)\s*[:\n]/i,
    skills: /(?:skills?|competenc(?:y|ies)|technical\s*skills?|expertise)\s*[:\n]/i,
    projects: /(?:projects?|portfolio|works?)\s*[:\n]/i,
    certifications: /(?:certifications?|certificates?|licenses?|credentials?)\s*[:\n]/i,
    languages: /(?:languages?|linguistic)\s*[:\n]/i,
    summary: /(?:summary|objective|profile|about\s*me|introduction)\s*[:\n]/i,
    contact: /(?:contact|email|phone|address|location)\s*[:\n]/i,
    publications: /(?:publications?|papers?|research)\s*[:\n]/i,
    awards: /(?:awards?|honors?|achievements?|recognition)\s*[:\n]/i,
  };
  
  // Find section positions
  const sectionPositions: { name: string; start: number }[] = [];
  
  for (const [name, pattern] of Object.entries(sectionPatterns)) {
    const match = cleanedText.match(pattern);
    if (match && match.index !== undefined) {
      sectionPositions.push({ name, start: match.index });
    }
  }
  
  // Sort by position
  sectionPositions.sort((a, b) => a.start - b.start);
  
  // Extract content for each section
  for (let i = 0; i < sectionPositions.length; i++) {
    const current = sectionPositions[i];
    const next = sectionPositions[i + 1];
    
    const start = current.start;
    const end = next ? next.start : cleanedText.length;
    
    sections[current.name] = cleanedText.slice(start, end).trim();
  }
  
  // If no sections found, treat entire text as content
  if (Object.keys(sections).length === 0) {
    sections['content'] = cleanedText;
  }
  
  return sections;
}
