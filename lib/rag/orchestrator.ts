import { randomUUID } from 'crypto';
import {
  ContextDocument,
  LLMClient,
  PushNotifier,
  Retriever,
} from './types';

type OrchestratorDeps = {
  retriever: Retriever;
  llmClient: LLMClient;
  pushNotifier: PushNotifier;
  logger?: Pick<Console, 'error' | 'info' | 'warn'>;
  pushTitle?: string;
  maxPushBodyLength?: number;
};

type OrchestratorResult = {
  sessionId: string;
  answer: string;
};

export class RagOrchestrator {
  private readonly retriever: Retriever;
  private readonly llmClient: LLMClient;
  private readonly pushNotifier: PushNotifier;
  private readonly logger: Pick<Console, 'error' | 'info' | 'warn'>;
  private readonly pushTitle: string;
  private readonly maxPushBodyLength: number;

  constructor(deps: OrchestratorDeps) {
    this.retriever = deps.retriever;
    this.llmClient = deps.llmClient;
    this.pushNotifier = deps.pushNotifier;
    this.logger = deps.logger ?? console;
    this.pushTitle = deps.pushTitle ?? 'New chatbot message';
    this.maxPushBodyLength = deps.maxPushBodyLength ?? 160;
  }

  async handleMessage(input: { message: string; sessionId?: string }): Promise<OrchestratorResult> {
    const sessionId = input.sessionId || randomUUID();
    const message = input.message.trim();

    // Fire-and-forget: do not block the RAG flow on push notification delivery
    void this.notifyOwner(sessionId, message);

    try {
      const documents = await this.retriever.retrieve(message);
      const answer = await this.llmClient.generateAnswer({
        question: message,
        documents,
      });
      return { sessionId, answer };
    } catch (error) {
      this.logger.error('RAG flow failed', error);
      return {
        sessionId,
        answer: 'Sorry, I could not generate a response right now. Please try again shortly.',
      };
    }
  }

  private async notifyOwner(sessionId: string, message: string): Promise<void> {
    const truncated =
      message.length > this.maxPushBodyLength
        ? `${message.slice(0, this.maxPushBodyLength)}...`
        : message;

    try {
      await this.pushNotifier.sendNotification({
        title: this.pushTitle,
        body: truncated,
        data: { sessionId, receivedAt: new Date().toISOString() },
      });
    } catch (error) {
      this.logger.warn('Failed to send push notification', error);
    }
  }
}
