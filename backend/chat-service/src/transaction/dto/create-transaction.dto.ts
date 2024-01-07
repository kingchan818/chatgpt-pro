export class CreateTransactionDto {
  messageId: string;
  message: string;
  parentMessageId?: string;
  apiTokenRef: string;
  chatOptions?: Record<string, any>;
  tokenUsage: Record<string, any>;
}
