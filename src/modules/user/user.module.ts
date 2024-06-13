// src/user/user.module.ts

// Importing necessary decorators and services from NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CategoryModel, CategorySchema, DomainModel, DomainSchema, UserSchema } from './schemas';
import { RoleModule } from '../role/role.module';
import { GrafanaLoggerService } from '../../service/grafana/grafana-axios';

// Defining the UserModule, which is a NestJS module for managing users
@Module({
  // Importing the MongooseModule for MongoDB integration and registering the UserService and UserController
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: DomainModel, schema: DomainSchema }]),
    MongooseModule.forFeature([{ name: CategoryModel, schema: CategorySchema }]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, GrafanaLoggerService],
  exports: [UserService],
})
export class UserModule {}
