// src/user/user.module.ts

// Importing necessary decorators and services from NestJS
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas';
import { RoleModule } from '../role/role.module';

// Defining the UserModule, which is a NestJS module for managing users
@Module({
  // Importing the MongooseModule for MongoDB integration and registering the UserService and UserController
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
