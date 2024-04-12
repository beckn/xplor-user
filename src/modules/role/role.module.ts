// src/role/role.module.ts

// Importing necessary decorators and services from NestJS
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schema/role.schema';

// Defining the RoleModule, which is a NestJS module for managing roles
@Module({
  // Importing the MongooseModule for MongoDB integration and registering the RoleService and RoleController
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
