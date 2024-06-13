import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseConfigService } from '../../config/database/database.config';
import envValidation from '../../config/env/validation/env.validation';
import configuration from '../../config/env/env.config';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../../service/redis/redis.module';
import { GrafanaLoggerService } from '../../service/grafana/grafana-axios';
import { LanguagePreferenceModule } from '../language-preference/module/language-preference.module';
import { DevicePreferenceModule } from '../device-preference/device-preference.module';

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
    RedisModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtModule.register({ global: true }),
    AuthModule,
    RoleModule,
    UserModule,
    LanguagePreferenceModule,
    DevicePreferenceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GrafanaLoggerService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
