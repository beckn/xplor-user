import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisService } from '../../service/redis/redis.service';
import { UserModule } from '../user/user.module';
import { CryptoService } from '../../service/crypto/crypto';
import { TwilioService } from '../../service/twilio/twilio';
import { DevicePreferenceModule } from '../device-preference/device-preference.module';

@Module({
  imports: [UserModule, DevicePreferenceModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService, CryptoService, TwilioService],
})
export class AuthModule {}
