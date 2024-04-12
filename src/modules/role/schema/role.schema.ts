// src/role/role.module.ts
// This file defines the RoleModule, which is a NestJS module for managing roles.
// It imports the MongooseModule for MongoDB integration and registers the RoleService and RoleController.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Defining the Role schema with decorators for MongoDB integration
@Schema({ timestamps: true })
export class Role extends Document {
  // Unique identifier for each role, generated using UUID
  @Prop({ default: () => `role_${uuidv4()}` })
  _id: string;

  // Type of the role, which can be either AGENT or SEEKER
  @Prop({ required: true, type: String })
  type: string;

  // Title of the role, a descriptive name for the role
  @Prop({ required: true, type: String })
  title: string;

  // Description of the role, providing more details about its purpose
  @Prop({ required: true, type: String })
  description: string;

  // URL of the image associated with the role, for visual representation
  @Prop({ required: true, type: String })
  imageUrl: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
