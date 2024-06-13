import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class DevicePreference {
  @Prop({ default: () => `device_${uuidv4()}` })
  _id: string;

  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ required: true })
  languageCode: string;

  @Prop({ default: null })
  roleId: string;

  @Prop({ type: [{ type: String, ref: 'Domain' }] })
  domains: string[];

  @Prop({ type: [{ type: String, ref: 'Category' }] })
  categories: string[];
}

export const DevicePreferenceModel = DevicePreference.name;
export type DevicePreferenceDocument = DevicePreference & Document;
export const DevicePreferenceSchema = SchemaFactory.createForClass(DevicePreference);
