import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DevicePreferenceService } from './device-preference.service';
import { DevicePreferenceController } from './device-preference.controller';
import { DevicePreferenceSchema } from './schema/device-preference.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'DevicePreference', schema: DevicePreferenceSchema }]), UserModule],
  controllers: [DevicePreferenceController],
  providers: [DevicePreferenceService],
  exports: [DevicePreferenceService],
})
export class DevicePreferenceModule {}
