// Lightweight in-memory vector store with TF-IDF + Cosine Similarity
// No external dependencies - pure TypeScript implementation

export interface Document {
  id: string;
  category: string;
  content: string;
}

export interface DocumentWithScore extends Document {
  score: number;  // Cosine similarity score (0-1, higher = more similar)
}

export interface SearchResult {
  documents: DocumentWithScore[];
  hasRelevantContent: boolean;  // True if any document has score > threshold
  maxScore: number;
}

// Simple tokenizer - splits on whitespace and punctuation, lowercases
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2); // Filter short words
}

// Build vocabulary from all documents
function buildVocabulary(documents: Document[]): Map<string, number> {
  const vocab = new Map<string, number>();
  let index = 0;
  
  for (const doc of documents) {
    const tokens = tokenize(doc.content);
    for (const token of tokens) {
      if (!vocab.has(token)) {
        vocab.set(token, index++);
      }
    }
  }
  
  return vocab;
}

// Calculate TF (term frequency) vector for a text
function calculateTF(text: string, vocab: Map<string, number>): number[] {
  const tokens = tokenize(text);
  const vector = new Array(vocab.size).fill(0);
  const tokenCounts = new Map<string, number>();
  
  // Count token occurrences
  for (const token of tokens) {
    tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
  }
  
  // Fill vector with normalized term frequencies
  Array.from(tokenCounts.entries()).forEach(([token, count]) => {
    const idx = vocab.get(token);
    if (idx !== undefined) {
      vector[idx] = count / tokens.length; // Normalize by document length
    }
  });
  
  return vector;
}

// Calculate IDF (inverse document frequency) for vocabulary
function calculateIDF(documents: Document[], vocab: Map<string, number>): number[] {
  const idf = new Array(vocab.size).fill(0);
  const docCount = documents.length;
  
  // Count how many documents contain each term
  const termDocCounts = new Map<string, number>();
  for (const doc of documents) {
    const uniqueTokens = new Set(tokenize(doc.content));
    Array.from(uniqueTokens).forEach((token) => {
      termDocCounts.set(token, (termDocCounts.get(token) || 0) + 1);
    });
  }
  
  // Calculate IDF: log(N / df)
  Array.from(vocab.entries()).forEach(([token, idx]) => {
    const df = termDocCounts.get(token) || 1;
    idf[idx] = Math.log(docCount / df) + 1; // Add 1 to avoid zero
  });
  
  return idf;
}

// Calculate TF-IDF vector
function calculateTFIDF(text: string, vocab: Map<string, number>, idf: number[]): number[] {
  const tf = calculateTF(text, vocab);
  return tf.map((tfVal, idx) => tfVal * idf[idx]);
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Vector Store class
export class VectorStore {
  private documents: Document[];
  private vocab: Map<string, number>;
  private idf: number[];
  private documentVectors: Map<string, number[]>;

  constructor(documents: Document[]) {
    this.documents = documents;
    this.vocab = buildVocabulary(documents);
    this.idf = calculateIDF(documents, this.vocab);
    this.documentVectors = new Map();
    
    // Pre-compute document vectors
    for (const doc of documents) {
      const vector = calculateTFIDF(doc.content, this.vocab, this.idf);
      this.documentVectors.set(doc.id, vector);
    }
  }

  // Relevance threshold - documents below this score are considered irrelevant
  // Lower threshold = more documents retrieved (better recall, might include less relevant)
  // Higher threshold = fewer documents (better precision, might miss relevant ones)
  private readonly RELEVANCE_THRESHOLD = 0.05;  // Lowered for better coverage

  // Search for similar documents using cosine similarity
  search(query: string, topK: number = 5): SearchResult {
    const queryVector = calculateTFIDF(query, this.vocab, this.idf);
    
    const results: DocumentWithScore[] = [];
    
    for (const doc of this.documents) {
      const docVector = this.documentVectors.get(doc.id);
      if (docVector) {
        // Calculate cosine similarity between query and document
        const score = cosineSimilarity(queryVector, docVector);
        results.push({ ...doc, score });
      }
    }
    
    // Sort by cosine similarity score (descending) and return top K
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    const maxScore = sortedResults.length > 0 ? sortedResults[0].score : 0;
    
    return {
      documents: sortedResults,
      hasRelevantContent: maxScore >= this.RELEVANCE_THRESHOLD,
      maxScore
    };
  }

  // Get all documents
  getAllDocuments(): Document[] {
    return this.documents;
  }
}

// Singleton instance with document count tracking
let vectorStoreInstance: VectorStore | null = null;
let lastDocumentCount = 0;

export function getVectorStore(documents: Document[]): VectorStore {
  // Recreate if documents changed (e.g., after ingestion)
  if (!vectorStoreInstance || documents.length !== lastDocumentCount) {
    vectorStoreInstance = new VectorStore(documents);
    lastDocumentCount = documents.length;
  }
  return vectorStoreInstance;
}

export function resetVectorStore(): void {
  vectorStoreInstance = null;
}
