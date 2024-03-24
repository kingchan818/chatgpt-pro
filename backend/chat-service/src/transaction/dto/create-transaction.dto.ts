import { supportModelType } from 'gpt-tokens';

export class CreateTransactionDto {
  messageId: string;
  message: string;
  parentMessageId?: string;
  apiTokenRef: string;
  chatOptions?: Record<string, any>;
  llmType: supportModelType | string;
  tokenUsage: Record<string, any>;
  collectionId: string;
  role: 'system' | 'user' | 'assistant';
}
