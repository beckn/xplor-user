// src/user/entities/user.entity.ts

// Importing necessary decorators from NestJS and Mongoose
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Importing the Persona and PersonaSchema for nested schema definition
import { Persona, PersonaSchema } from './index';
import { Kyc, KycSchema } from './kyc.schema';

// Defining the User entity class, which represents a user in the system.
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: () => `user_${uuidv4()}` })
  _id: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ type: String, default: '' })
  profileUrl: string;

  @Prop({ type: String })
  countryCode: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: Boolean, default: false })
  kycStatus: boolean;

  @Prop({ type: PersonaSchema, default: null })
  persona: Persona;

  @Prop({ type: String, ref: 'Role', default: null })
  role: string;

  @Prop({ type: KycSchema, default: null })
  kyc: Kyc;

  @Prop({ type: String, default: null })
  wallet: string;

  @Prop({ type: String, default: null })
  mPin: string;

  @Prop({ type: String, default: null })
  languagePreference: string;

  @Prop({ type: [{ type: String, ref: 'Domain' }] })
  domains: string[];

  @Prop({ type: [{ type: String, ref: 'Category' }] })
  categories: string[];

  @Prop({ type: String, default: null })
  accessTokenExpiry?: string;

  @Prop({ type: String, default: null })
  refreshToken: string;

  @Prop({ type: String, default: null })
  refreshTokenExpiry?: string;
}

// Factory function to create a Mongoose schema based on the User class
export const UserSchema = SchemaFactory.createForClass(User);
