import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true, index: true, unique: true })
  openAIToken: string;

  @Prop({ type: [String], index: true, default: [], unique: true, max: 20 })
  apiKeys: string[];

  @Prop({ default: Date.now, required: true })
  updatedDT: string;

  @Prop({ default: Date.now, required: true })
  createdDT: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
