import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true, index: true, unique: true })
  openAIToken: string;

  @Prop({ type: [{ type: String, ref: 'ApiKey' }], default: [] })
  apiKeys: string[]; // Array of ApiKey values (which are the _id in ApiKey collection)

  @Prop({ default: () => new Date().toISOString(), required: true })
  updatedDT: string;

  @Prop({ default: () => new Date().toISOString(), required: true })
  createdDT: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
