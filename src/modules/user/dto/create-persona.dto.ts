// src/user/dto/create-persona.dto.ts

// Importing necessary decorators from class-validator and class-transformer
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Importing the AttributeDto for nested validation
import { AttributeDto } from './create-attribute.dto';

// DTO for creating a new persona, which includes an array of interests represented by AttributeDto
export class CreatePersonaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  interest: AttributeDto[];
}
