import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseConfigService } from '../../config/database/database.config';
import envValidation from '../../config/env/validation/env.validation';
import configuration from '../../config/env/env.config';
import { RedisOptions } from '../../config/redis/redis.config';
import { RedisService } from '../../service/redis/redis';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserModule } from '../user/user.module';

// The AppModule is the root module of the application.
// It imports other modules such as RoleModule, AuthModule, and UserModule,
// and configures global settings like ConfigModule, CacheModule, and MongooseModule.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object(envValidation()),
      validationOptions: {
        abortEarly: false,
      },
    }),
    CacheModule.registerAsync(RedisOptions),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtModule.register({ global: true }),
    AuthModule,
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
