import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateDevicePreferenceDto } from './dto/create-device-preference.dto';
import { UpdateDevicePreferenceDto } from './dto/update-device-preference.dto';
import { DevicePreference, DevicePreferenceModel } from './schema/device-preference.schema';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { DevicePreferenceErrorMessage } from '../../common/constant/device-preference/device-preference';
import { UserService } from '../user/user.service';

@Injectable()
export class DevicePreferenceService {
  private readonly logger: Logger = new Logger(DevicePreferenceService.name);
  constructor(
    @InjectModel(DevicePreferenceModel) private readonly devicePreferenceModel: Model<DevicePreference>,
    private readonly userService: UserService,
  ) {}
  async create(createDevicePreferenceDto: CreateDevicePreferenceDto) {
    try {
      const devicePreference = await this.devicePreferenceModel.create(createDevicePreferenceDto);
      return getSuccessResponse(devicePreference, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      if (error?.code === 11000) throw new BadRequestException(DevicePreferenceErrorMessage.deviceAlreadyExist);
      throw new Error(error);
    }
  }

  async update(deviceId: string, updateDevicePreferenceDto: UpdateDevicePreferenceDto) {
    try {
      const devicePreference = await this.devicePreferenceModel.findOne({ deviceId: deviceId });
      if (!devicePreference) throw new NotFoundException(DevicePreferenceErrorMessage.deviceNotFound);
      const updatedDevicePreference = await this.devicePreferenceModel.findOneAndUpdate(
        { deviceId: deviceId },
        updateDevicePreferenceDto,
        { new: true },
      );
      return getSuccessResponse(updatedDevicePreference, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDeviceInfo(deviceId: string) {
    try {
      const devicePreference: any = await this.devicePreferenceModel.findOne({ deviceId: deviceId });
      if (!devicePreference) throw new NotFoundException(DevicePreferenceErrorMessage.deviceNotFound);
      const domainIds = devicePreference.domains || [];
      const domainData = (await this.userService.getDomainByIds(domainIds))?.data || [];
      return getSuccessResponse({ ...devicePreference._doc, domainData }, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteDevicePreference(deviceId: string) {
    try {
      const devicePreference = await this.devicePreferenceModel.findOne({ deviceId: deviceId });

      if (!devicePreference) throw new NotFoundException(DevicePreferenceErrorMessage.deviceNotFound);
      const deletedDevicePreference = await this.devicePreferenceModel.deleteOne({ deviceId: deviceId });
      return getSuccessResponse(deletedDevicePreference, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
