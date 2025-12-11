/**
 * PDF Ingestion API
 * Upload a PDF (CV/Resume) and extract text to add to the knowledge base
 * 
 * POST /api/ingest
 * Content-Type: multipart/form-data
 * Body: file (PDF file)
 * 
 * Returns the extracted documents that will be added to the knowledge base
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { parsePDF, chunkText, extractCVSections } from '../../lib/pdfParser';
import fs from 'fs';
import path from 'path';

// Disable body parsing to handle file upload manually
export const config = {
  api: {
    bodyParser: false,
  },
};

interface KnowledgeDocument {
  id: string;
  category: string;
  content: string;
}

interface IngestResponse {
  success: boolean;
  message: string;
  documentsAdded?: number;
  documents?: KnowledgeDocument[];
  error?: string;
}

/**
 * Simple multipart form data parser for file upload
 */
async function parseFormData(req: NextApiRequest): Promise<Buffer | null> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunks: any[] = [];
    
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      
      // Find the PDF content in multipart data
      const boundaryMatch = req.headers['content-type']?.match(/boundary=(.+)/);
      if (!boundaryMatch) {
        // Maybe it's raw PDF data
        if (buffer[0] === 0x25 && buffer[1] === 0x50) { // %P (PDF magic bytes)
          resolve(buffer);
          return;
        }
        resolve(null);
        return;
      }
      
      const boundary = boundaryMatch[1];
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      
      // Find PDF content between boundaries
      const bufferStr = buffer.toString('binary');
      const parts = bufferStr.split(`--${boundary}`);
      
      for (const part of parts) {
        if (part.includes('application/pdf') || part.includes('.pdf')) {
          // Find the start of binary content (after \r\n\r\n)
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            const content = part.slice(headerEnd + 4);
            // Remove trailing boundary markers
            const cleanContent = content.replace(/\r\n--.*$/s, '');
            resolve(Buffer.from(cleanContent, 'binary'));
            return;
          }
        }
      }
      
      resolve(null);
    });
    
    req.on('error', reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IngestResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST requests are accepted',
    });
  }

  try {
    // Parse the uploaded file
    const fileBuffer = await parseFormData(req);
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided',
        error: 'Please upload a valid PDF file',
      });
    }

    // Parse the PDF
    const pdfResult = await parsePDF(fileBuffer);
    
    if (!pdfResult.text || pdfResult.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF',
        error: 'The PDF might be image-based or empty',
      });
    }

    // Extract CV sections
    const sections = extractCVSections(pdfResult.text);
    
    // Create knowledge base documents
    const newDocuments: KnowledgeDocument[] = [];
    const timestamp = Date.now();
    
    // Add section-based documents
    for (const [sectionName, content] of Object.entries(sections)) {
      if (content.trim().length > 20) { // Only add meaningful content
        // Chunk large sections
        const chunks = chunkText(content, 800);
        
        chunks.forEach((chunk, index) => {
          newDocuments.push({
            id: `cv_${sectionName}_${timestamp}_${index}`,
            category: `cv_${sectionName}`,
            content: chunk,
          });
        });
      }
    }

    // Also add the full text as chunks for general queries
    const fullTextChunks = chunkText(pdfResult.text, 600);
    fullTextChunks.forEach((chunk, index) => {
      newDocuments.push({
        id: `cv_full_${timestamp}_${index}`,
        category: 'cv_content',
        content: chunk,
      });
    });

    // Load existing knowledge base
    const kbPath = path.join(process.cwd(), 'data', 'knowledge-base.json');
    let existingDocs: KnowledgeDocument[] = [];
    
    try {
      const kbContent = fs.readFileSync(kbPath, 'utf-8');
      existingDocs = JSON.parse(kbContent);
    } catch (error) {
      // Knowledge base doesn't exist, start fresh
      console.log('Creating new knowledge base');
    }

    // Remove old CV documents (those starting with cv_)
    const filteredDocs = existingDocs.filter(doc => !doc.id.startsWith('cv_'));
    
    // Merge with new documents
    const updatedDocs = [...filteredDocs, ...newDocuments];

    // Write back to knowledge base
    fs.writeFileSync(kbPath, JSON.stringify(updatedDocs, null, 2), 'utf-8');

    return res.status(200).json({
      success: true,
      message: `Successfully ingested PDF with ${pdfResult.numPages} pages`,
      documentsAdded: newDocuments.length,
      documents: newDocuments.slice(0, 5), // Return first 5 as preview
    });

  } catch (error) {
    console.error('Ingestion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process PDF',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
