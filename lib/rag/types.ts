export type ContextDocument = {
  id: string;
  content: string;
  source?: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

export interface Retriever {
  retrieve(query: string): Promise<ContextDocument[]>;
}

export interface LLMClient {
  generateAnswer(input: {
    question: string;
    documents: ContextDocument[];
  }): Promise<string>;
}

export interface PushNotifier {
  sendNotification(input: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<void>;
}
