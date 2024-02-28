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

  @Prop({ required: true, index: true }) // the collection id from the user's chat side
  collectionId: string;

  @Prop({ required: true })
  llmType: string;

  @Prop({ default: () => new Date().toISOString(), required: true })
  createdDT: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
