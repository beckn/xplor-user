// src/user/entities/provider.entity.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Importing the IProvider interface for type checking
import { IProvider } from '../interface/provider';

// Defining the Provider entity class, which represents a provider in the system.
@Schema()
export class Provider extends Document implements IProvider {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

// Factory function to create a Mongoose schema based on the Provider class
export const ProviderSchema = SchemaFactory.createForClass(Provider);
