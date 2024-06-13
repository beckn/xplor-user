// categories.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Domain extends Document {
  @Prop({ default: () => `domain_${uuidv4()}` })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string;
}

export const DomainModel = Domain.name;
export type DomainDocument = Domain & Document;
export const DomainSchema = SchemaFactory.createForClass(Domain);
