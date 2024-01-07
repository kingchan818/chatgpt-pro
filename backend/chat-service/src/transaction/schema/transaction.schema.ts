import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'transactions' })
export class Transaction extends Document {
  @Prop({ required: true, index: true })
  messageId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object, default: {} })
  chatOptions: object;

  @Prop()
  parentMessageId: string;

  @Prop({ type: Object, default: {} })
  tokenUsage: object;

  @Prop({ required: true, index: true })
  apiTokenRef: string; // the api key created on our side

  @Prop({ default: Date.now, required: true })
  createdDT: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
