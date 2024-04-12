// src/user/entities/attribute.entity.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Defining the Attribute entity class, which represents an attribute in the system.
@Schema()
export class Attribute extends Document {
  @Prop({ default: () => `attr_${uuidv4()}` })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

// Factory function to create a Mongoose schema based on the Attribute class
export const AttributeSchema = SchemaFactory.createForClass(Attribute);
