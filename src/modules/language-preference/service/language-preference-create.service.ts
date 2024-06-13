import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LanguagePreference } from '../schema/language-preference.schema';
import { CreateGuestLanguageDto } from '../dto/create-guest-language.dto';
import { HttpResponseMessage } from '../../../common/enums/HttpResponseMessage';
import { getSuccessResponse } from '../../../util/getSuccessResponse';
@Injectable()
export class LanguagePreferenceCreateService {
  constructor(
    @InjectModel(LanguagePreference.name) private readonly languagePreferenceModel: Model<LanguagePreference>,
  ) {}

  // Creates a language preference record against a deviceId
  async createLanguagePreference(createGuestLanguageDto: CreateGuestLanguageDto): Promise<any> {
    const preference = await this.languagePreferenceModel.create(createGuestLanguageDto);
    return getSuccessResponse(preference, HttpResponseMessage.OK);
  }
}
