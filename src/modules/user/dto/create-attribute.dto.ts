// src/user/dto/create-attribute.dto.ts

// Importing necessary decorators from class-validator
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO for creating a new attribute, which includes name, updated_at, and created_at fields
export class AttributeDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsOptional()
  updated_at: Date;

  @IsDateString()
  @IsOptional()
  created_at: Date;
}
