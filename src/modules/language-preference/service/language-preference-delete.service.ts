import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LanguagePreference } from '../schema/language-preference.schema';
import { HttpResponseMessage } from '../../../common/enums/HttpResponseMessage';
import { getSuccessResponse } from '../../../util/getSuccessResponse';
import { LanguagePreferenceMessage } from '../../../common/constant/user/dto-message';
@Injectable()
export class LanguagePreferenceDeleteService {
  constructor(
    @InjectModel(LanguagePreference.name) private readonly languagePreferenceModel: Model<LanguagePreference>,
  ) {}

  // Deletes a language preference record against a deviceId
  async deleteLanguagePreference(deviceId: string): Promise<any> {
    const preference = await this.languagePreferenceModel.findOneAndDelete({ deviceId });

    if (!preference) {
      throw new NotFoundException(LanguagePreferenceMessage.notFound);
    }

    return getSuccessResponse(preference, HttpResponseMessage.OK);
  }
}
