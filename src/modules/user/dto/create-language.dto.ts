import { IsNotEmpty, IsString } from 'class-validator';

// DTO for creating a new language preference
export class CreateLanguageDto {
  @IsNotEmpty()
  @IsString()
  languagePreference: string;
}
