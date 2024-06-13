import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RegionLanguage {
  @Prop({ required: true })
  region: string;

  @Prop({ required: true, type: [{ language: String, percentage: String }] })
  languages: {
    language: string;
    percentage: string;
  }[];

  @Prop({ default: 1 })
  accessCount: number;
}

export const RegionLanguageModel = RegionLanguage.name;
export type RegionLanguageDocument = RegionLanguage & Document;
export const RegionLanguageSchema = SchemaFactory.createForClass(RegionLanguage);
// RegionLanguageSchema.index({created}, { expireAfterSeconds: 60 });
