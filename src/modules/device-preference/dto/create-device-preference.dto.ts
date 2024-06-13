import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDevicePreferenceDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsOptional()
  languageCode?: string;

  @IsString()
  @IsOptional()
  roleId?: string;

  @IsArray()
  @IsOptional()
  domains?: string[];

  @IsArray()
  @IsOptional()
  categories?: string[];
}
