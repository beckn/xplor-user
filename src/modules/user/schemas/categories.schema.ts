// categories.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Category extends Document {
  @Prop({ default: () => `category_${uuidv4()}` })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  value: string;
}

export const CategoryModel = Category.name;
export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
