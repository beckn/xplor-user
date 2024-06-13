import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ timestamps: true })
export class LanguagePreference {
  @Prop({ default: () => `language_${uuidv4()}` })
  _id: string;

  @Prop({ required: true })
  languageCode: string;

  @Prop({ required: true })
  deviceId: string;
}

export const LanguagePreferenceModel = LanguagePreference.name;
export type LanguagePreferenceDocument = LanguagePreference & Document;
export const LanguagePreferenceSchema = SchemaFactory.createForClass(LanguagePreference);
