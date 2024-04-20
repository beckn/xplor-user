// src/user/entities/user.entity.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Importing the Persona and PersonaSchema for nested schema definition
import { Persona, PersonaSchema } from './index';
import { Kyc, KycSchema } from './kyc.schema';

// Defining the User entity class, which represents a user in the system.
@Schema()
export class User extends Document {
  @Prop({ default: () => `user_${uuidv4()}` })
  _id: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: Boolean, default: false })
  kycStatus: boolean;

  @Prop({ type: PersonaSchema })
  persona: Persona;

  @Prop({ type: String, ref: 'Role' })
  role: string;

  @Prop({ type: KycSchema })
  kyc: Kyc;

  @Prop({ type: String, default: null })
  wallet: string;

  @Prop({ type: String, default: null })
  mPin: string;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

// Factory function to create a Mongoose schema based on the User class
export const UserSchema = SchemaFactory.createForClass(User);
