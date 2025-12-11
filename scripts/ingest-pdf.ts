/**
 * CLI Script to ingest a PDF into the knowledge base
 * 
 * Usage:
 *   npx ts-node scripts/ingest-pdf.ts <path-to-pdf>
 * 
 * Or with tsx:
 *   npx tsx scripts/ingest-pdf.ts <path-to-pdf>
 */

import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

interface KnowledgeDocument {
  id: string;
  category: string;
  content: string;
}

// Clean and normalize text
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

// Split text into chunks
function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const chunks: string[] = [];
  const cleanedText = cleanText(text);
  
  // Split by paragraphs
  const paragraphs = cleanedText.split(/\n\n+/).filter(p => p.trim());
  
  let currentChunk = '';
  
  for (const para of paragraphs) {
    if ((currentChunk + para).length <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      
      // If paragraph itself is too long, split by sentences
      if (para.length > maxChunkSize) {
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        currentChunk = '';
        
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
      } else {
        currentChunk = para;
      }
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/ingest-pdf.ts <path-to-pdf>');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/ingest-pdf.ts ./my-cv.pdf');
    process.exit(1);
  }
  
  const pdfPath = args[0];
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: File not found: ${pdfPath}`);
    process.exit(1);
  }
  
  console.log(`📄 Reading PDF: ${pdfPath}`);
  
  // Read and parse PDF
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdf(pdfBuffer);
  
  console.log(`📖 Extracted ${pdfData.numpages} pages`);
  console.log(`📝 Text length: ${pdfData.text.length} characters`);
  
  // Create knowledge base documents
  const chunks = chunkText(pdfData.text, 600);
  const timestamp = Date.now();
  
  const newDocuments: KnowledgeDocument[] = chunks.map((chunk, index) => ({
    id: `cv_chunk_${timestamp}_${index}`,
    category: 'cv_content',
    content: chunk,
  }));
  
  console.log(`✂️  Created ${newDocuments.length} document chunks`);
  
  // Load existing knowledge base
  const kbPath = path.join(__dirname, '..', 'data', 'knowledge-base.json');
  let existingDocs: KnowledgeDocument[] = [];
  
  try {
    const kbContent = fs.readFileSync(kbPath, 'utf-8');
    const parsed = JSON.parse(kbContent);
    // Handle both formats: { documents: [...] } or [...]
    existingDocs = Array.isArray(parsed) ? parsed : (parsed.documents || []);
    console.log(`📚 Loaded ${existingDocs.length} existing documents`);
  } catch (error) {
    console.log('📚 No existing knowledge base found, creating new one');
  }
  
  // Remove old CV documents
  const filteredDocs = existingDocs.filter(doc => !doc.id.startsWith('cv_'));
  console.log(`🗑️  Removed ${existingDocs.length - filteredDocs.length} old CV documents`);
  
  // Merge
  const updatedDocs = [...filteredDocs, ...newDocuments];
  
  // Ensure data directory exists
  const dataDir = path.dirname(kbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write back as flat array (compatible with vectorStore)
  fs.writeFileSync(kbPath, JSON.stringify(updatedDocs, null, 2), 'utf-8');
  
  console.log(`✅ Knowledge base updated with ${updatedDocs.length} total documents`);
  console.log('');
  console.log('Preview of first 3 chunks:');
  console.log('─'.repeat(50));
  
  newDocuments.slice(0, 3).forEach((doc, i) => {
    console.log(`\n[${i + 1}] ${doc.id}`);
    console.log(doc.content.substring(0, 200) + (doc.content.length > 200 ? '...' : ''));
  });
}

main().catch(console.error);
