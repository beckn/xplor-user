// This file contains the validation schema for environment variables.
// It uses Joi to define the structure and constraints of the environment variables.
// This ensures that the application has the correct configuration values.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('databaseUrl'),
    };
  }
}
