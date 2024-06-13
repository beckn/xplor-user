import { Controller, Post, Body, Patch, Get, Param, Delete } from '@nestjs/common';

import { DevicePreferenceService } from './device-preference.service';
import { CreateDevicePreferenceDto } from './dto/create-device-preference.dto';
import { UpdateDevicePreferenceDto } from './dto/update-device-preference.dto';
import { Public } from '../../common/decorator/public.decorator';

@Public()
@Controller('device-preference')
export class DevicePreferenceController {
  constructor(private readonly DevicePreferenceService: DevicePreferenceService) {}

  @Post()
  createDevicePreference(@Body() createDevicePreferenceDto: CreateDevicePreferenceDto) {
    return this.DevicePreferenceService.create(createDevicePreferenceDto);
  }

  @Patch()
  updateDevicePreference(@Body() updateDevicePreferenceDto: UpdateDevicePreferenceDto) {
    return this.DevicePreferenceService.update(updateDevicePreferenceDto.deviceId, updateDevicePreferenceDto);
  }

  @Get(':id')
  getDevicePreference(@Param('id') deviceId: string) {
    return this.DevicePreferenceService.getDeviceInfo(deviceId);
  }

  @Delete(':id')
  deleteDevicePreference(@Param('id') deviceId: string) {
    return this.DevicePreferenceService.deleteDevicePreference(deviceId);
  }
}
