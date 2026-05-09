import { PushNotifier } from './types';

type NtfyNotifierConfig = {
  topic: string;
  token?: string;
  baseUrl?: string;
  timeoutMs?: number;
  logger?: Pick<Console, 'warn' | 'error'>;
};

export class NtfyNotifier implements PushNotifier {
  private readonly url: string;
  private readonly token?: string;
  private readonly timeoutMs: number;
  private readonly logger: Pick<Console, 'warn' | 'error'>;

  constructor(config: NtfyNotifierConfig) {
    const baseUrl = config.baseUrl ?? 'https://ntfy.sh';
    this.url = `${baseUrl.replace(/\/+$/, '')}/${config.topic}`;
    this.token = config.token;
    this.timeoutMs = config.timeoutMs ?? 4000;
    this.logger = config.logger ?? console;
  }

  async sendNotification(input: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<void> {
    const message = this.buildMessage(input.body, input.data);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      Title: input.title,
      Priority: '3', // default priority
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers,
        body: message,
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.warn(`ntfy notification failed: ${response.status} ${text}`);
      }
    } catch (error) {
      this.logger.warn('ntfy notification error', error as Error);
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildMessage(body: string, data?: Record<string, unknown>): string {
    const parts = [body];

    if (data?.sessionId) {
      parts.push(`Session: ${String(data.sessionId)}`);
    }

    if (data) {
      const { sessionId, ...rest } = data;
      const restKeys = Object.keys(rest);
      if (restKeys.length > 0) {
        parts.push(`Meta: ${JSON.stringify(rest)}`);
      }
    }

    const combined = parts.join('\n').trim();
    const maxLength = 4096; // ntfy message limit
    if (combined.length > maxLength) {
      return `${combined.slice(0, maxLength - 3)}...`;
    }
    return combined;
  }
}
