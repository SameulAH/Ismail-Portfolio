import { ContextDocument, LLMClient } from './types';

export class TemplateLLMClient implements LLMClient {
  async generateAnswer(input: {
    question: string;
    documents: ContextDocument[];
  }): Promise<string> {
    const contextSummary = input.documents
      .map((doc) => `- (${doc.source ?? doc.id}) ${doc.content}`)
      .join('\n');

    const contextBlock =
      contextSummary.length > 0
        ? `\n\nContext:\n${contextSummary}`
        : '\n\nContext: None found.';

    return `Answer: ${input.question}${contextBlock}\n\nThis is a placeholder response. Replace TemplateLLMClient with a real LLM provider implementation.`;
  }
}
