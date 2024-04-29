import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'apiKeys' })
export class ApiKey extends Document {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  usageCount: number;

  @Prop({ required: true, default: 0 })
  usageLimit: number;

  @Prop({ default: () => new Date().toISOString(), required: true })
  updatedDT: string;

  @Prop({ default: () => new Date().toISOString(), required: true })
  createdDT: string;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
ApiKeySchema.virtual('value').get(function () {
  return this._id;
});
