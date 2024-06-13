import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LanguagePreferenceCreateService } from '../service/language-preference-create.service';
import { LanguagePreferenceModel, LanguagePreferenceSchema } from '../schema/language-preference.schema';
import { LanguagePreferenceReadService } from '../service/language-preference-read.service';
import { LanguagePreferenceDeleteService } from '../service/language-preference-delete.service';
import { LanguagePreferenceController } from '../controller/language.controller';
import { RegionLanguageService } from '../service/region-languages.service';
import { RegionLanguageModel, RegionLanguageSchema } from '../schema/region-languages.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LanguagePreferenceModel, schema: LanguagePreferenceSchema }]),
    MongooseModule.forFeature([{ name: RegionLanguageModel, schema: RegionLanguageSchema }]),
  ],
  providers: [
    LanguagePreferenceCreateService,
    LanguagePreferenceReadService,
    LanguagePreferenceDeleteService,
    RegionLanguageService,
  ],
  exports: [LanguagePreferenceCreateService, LanguagePreferenceReadService, LanguagePreferenceDeleteService],
  controllers: [LanguagePreferenceController],
})
export class LanguagePreferenceModule {}
