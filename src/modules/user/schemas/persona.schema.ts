// src/user/entities/persona.entity.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Importing the Attribute and AttributeSchema for nested schema definition
import { Attribute, AttributeSchema } from './attribute.schema';

// Defining the Persona entity class, which represents a persona in the system.
@Schema()
export class Persona extends Document {
  @Prop({ default: () => `pers_${uuidv4()}` })
  _id: string;

  @Prop({ type: [{ type: AttributeSchema }], default: [] })
  interest: Attribute[];

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

// Factory function to create a Mongoose schema based on the Persona class
export const PersonaSchema = SchemaFactory.createForClass(Persona);
