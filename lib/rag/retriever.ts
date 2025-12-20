import { ContextDocument, Retriever } from './types';

export class StaticRetriever implements Retriever {
  private readonly documents: ContextDocument[];
  private readonly limit: number;

  constructor(documents: ContextDocument[], limit: number = 5) {
    this.documents = documents;
    this.limit = limit;
  }

  async retrieve(query: string): Promise<ContextDocument[]> {
    const normalizedQuery = query.toLowerCase();

    const scored = this.documents.map((doc) => ({
      doc,
      score: this.score(normalizedQuery, doc.content),
    }));

    return scored
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.limit)
      .map((entry) => ({ ...entry.doc, score: entry.score }));
  }

  private score(query: string, content: string): number {
    const normalizedContent = content.toLowerCase();
    if (normalizedContent.includes(query)) {
      return 1;
    }

    const queryTerms = query.split(/\s+/).filter(Boolean);
    if (queryTerms.length === 0) {
      return 0;
    }

    const matchCount = queryTerms.reduce(
      (count, term) => (normalizedContent.includes(term) ? count + 1 : count),
      0
    );

    return matchCount / queryTerms.length;
  }
}
