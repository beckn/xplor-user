import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { RegionLanguage, RegionLanguageDocument } from '../schema/region-languages.schema';
import { CreateRegionLanguageDto } from '../dto/create-region-language.dto';
import { QueryReqionLangaugeDto } from '../dto/query-region-language.dto';
import { getSuccessResponse } from '../../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../../common/enums/HttpResponseMessage';

@Injectable()
export class RegionLanguageService {
  private readonly regionalLanguageAccessCount: number;
  constructor(
    @InjectModel(RegionLanguage.name) private regionLanguageModel: Model<RegionLanguageDocument>,
    private configService: ConfigService,
  ) {
    this.regionalLanguageAccessCount = Number(this.configService.get('regionalLanguageAccessCount'));
  }

  // Create Region Language
  async createLanguagesForRegion(createRegionLanguageDto: CreateRegionLanguageDto): Promise<any> {
    const createdRegionLanguage = new this.regionLanguageModel(createRegionLanguageDto);
    const regionLang = await createdRegionLanguage.save();
    return getSuccessResponse(regionLang, HttpResponseMessage.OK);
  }

  // Get Region Language
  async findLanguagesForRegion(queryReqionLangaugeDto: QueryReqionLangaugeDto): Promise<any> {
    try {
      const regionLang = await this.regionLanguageModel.find({ region: queryReqionLangaugeDto.region }).exec();
      if (regionLang.length === 0) return getSuccessResponse([], HttpResponseMessage.OK);
      else if (regionLang[0]?.accessCount > this.regionalLanguageAccessCount) {
        await this.regionLanguageModel.deleteOne({ region: queryReqionLangaugeDto.region }).exec();
        return getSuccessResponse([], HttpResponseMessage.OK);
      } else {
        await this.regionLanguageModel
          .updateOne({ region: queryReqionLangaugeDto.region }, { $inc: { accessCount: 1 } })
          .exec();
        return getSuccessResponse(regionLang, HttpResponseMessage.OK);
      }
    } catch (error) {
      throw error;
    }
  }
}
