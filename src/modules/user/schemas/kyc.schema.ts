// src/user/entities/kyc.schema.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Importing the IProvider interface for type checking
import { IProvider } from '../interface/provider';

// Defining the Kyc schema for MongoDB using Mongoose
@Schema()
export class Kyc extends Document {
  @Prop({ default: () => `kyc_${uuidv4()}` })
  _id: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ type: Object, required: true })
  provider: IProvider;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

// Factory function to create a Mongoose schema based on the Kyc class
export const KycSchema = SchemaFactory.createForClass(Kyc);
