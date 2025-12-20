import { PushNotifier } from './types';

type PushNotifierConfig = {
  endpoint: string;
  token?: string;
  timeoutMs?: number;
};

type PushoverConfig = {
  token: string;
  userKey: string;
  endpoint?: string;
  timeoutMs?: number;
  logger?: Pick<Console, 'warn' | 'error'>;
};

export class HttpPushNotifier implements PushNotifier {
  private readonly endpoint: string;
  private readonly token?: string;
  private readonly timeoutMs: number;

  constructor(config: PushNotifierConfig) {
    this.endpoint = config.endpoint;
    this.token = config.token;
    this.timeoutMs = config.timeoutMs ?? 5000;
  }

  async sendNotification(input: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: JSON.stringify({
          title: input.title,
          body: input.body,
          data: input.data,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

export class PushoverNotifier implements PushNotifier {
  private readonly endpoint: string;
  private readonly token: string;
  private readonly userKey: string;
  private readonly timeoutMs: number;
  private readonly logger: Pick<Console, 'warn' | 'error'>;

  constructor(config: PushoverConfig) {
    this.endpoint = config.endpoint ?? 'https://api.pushover.net/1/messages.json';
    this.token = config.token;
    this.userKey = config.userKey;
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

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: this.token,
          user: this.userKey,
          title: input.title,
          message,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.warn(`Pushover notification failed: ${response.status} ${text}`);
      }
    } catch (error) {
      this.logger.warn('Pushover notification error', error as Error);
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
    const maxLength = 1024; // Pushover message limit
    if (combined.length > maxLength) {
      return `${combined.slice(0, maxLength - 3)}...`;
    }
    return combined;
  }
}

export class NoopPushNotifier implements PushNotifier {
  async sendNotification(): Promise<void> {
    return;
  }
}
