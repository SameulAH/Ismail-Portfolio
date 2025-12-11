// API endpoint to view and search the knowledge base
import type { NextApiRequest, NextApiResponse } from 'next';
import { getVectorStore, Document, SearchResult } from '../../lib/vectorStore';
import knowledgeBaseData from '../../data/knowledge-base.json';

type ResponseData = {
  documents?: Document[];
  searchResult?: SearchResult;
  query?: string;
  error?: string;
};

// Handle both formats: { documents: [...] } or [...]
function getDocuments(): Document[] {
  if (Array.isArray(knowledgeBaseData)) {
    return knowledgeBaseData as Document[];
  }
  return (knowledgeBaseData as { documents: Document[] }).documents || [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const documents = getDocuments();
  const vectorStore = getVectorStore(documents);

  if (req.method === 'GET') {
    const query = req.query.q as string | undefined;
    
    if (query) {
      // Search mode - returns cosine similarity results
      const searchResult = vectorStore.search(query, 5);
      return res.status(200).json({ 
        query,
        searchResult 
      });
    } else {
      // List all documents
      return res.status(200).json({ 
        documents: vectorStore.getAllDocuments() 
      });
    }
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ error: 'Method not allowed' });
}
