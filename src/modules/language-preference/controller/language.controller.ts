import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';

import { CreateGuestLanguageDto } from '../dto/create-guest-language.dto';
import { LanguagePreferenceCreateService } from '../service/language-preference-create.service';
import { LanguagePreferenceReadService } from '../service/language-preference-read.service';
import { LanguagePreferenceDeleteService } from '../service/language-preference-delete.service';
import { Public } from '../../../common/decorator/public.decorator';
import { RegionLanguageService } from '../service/region-languages.service';
import { CreateRegionLanguageDto } from '../dto/create-region-language.dto';
import { QueryReqionLangaugeDto } from '../dto/query-region-language.dto';

@Public()
@Controller('language-preference')
export class LanguagePreferenceController {
  // Injecting the RoleService into the controller
  constructor(
    private readonly languageCreateService: LanguagePreferenceCreateService,
    private readonly languageDeleteService: LanguagePreferenceDeleteService,
    private readonly languageReadService: LanguagePreferenceReadService,
    private readonly regionLanguageService: RegionLanguageService,
  ) {}
  // Endpoint for creating language preference for region
  @Post('region')
  createRegionLanguage(@Body() createRegionLanguageDto: CreateRegionLanguageDto) {
    return this.regionLanguageService.createLanguagesForRegion(createRegionLanguageDto);
  }

  // Endpoint for returning language preference for region
  @Get('region')
  getRegionLanguage(@Query() queryReqionLangaugeDto: QueryReqionLangaugeDto) {
    return this.regionLanguageService.findLanguagesForRegion(queryReqionLangaugeDto);
  }

  // Endpoint for creating a language preference
  @Post()
  create(@Body() createLanguage: CreateGuestLanguageDto) {
    return this.languageCreateService.createLanguagePreference(createLanguage);
  }

  // Endpoint for returning language preference with deviceId
  @Get()
  findByDeviceId(@Query('deviceId') deviceId: string) {
    return this.languageReadService.getLanguagePreference(deviceId);
  }

  // Endpoint for deleting language preference with deviceId
  @Delete()
  deleteLanguagePreference(@Query('deviceId') deviceId: string) {
    return this.languageDeleteService.deleteLanguagePreference(deviceId);
  }
}
