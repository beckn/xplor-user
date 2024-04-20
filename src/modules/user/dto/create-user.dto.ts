// src/user/dto/create-user.dto.ts

// Importing necessary decorators from class-validator and class-transformer
import { IsBoolean, IsOptional, IsString, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CustomPhoneValidator } from '../../../common/decorator/custom-phone-validator-dto';
import { CreateKycDto } from './create-kyc.dto';
import { PhoneNumberDtoMessage } from '../../../common/constant/user/dto-message';

// DTO for creating a new user, which includes various personal details and optional KYC information
export class CreateUserDto {
  @Validate(CustomPhoneValidator, [PhoneNumberDtoMessage.Dummy, { message: '' }])
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsBoolean()
  kycStatus?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateKycDto)
  kyc?: CreateKycDto;

  @IsOptional()
  @IsString()
  wallet: string;

  @IsOptional()
  @IsString()
  mPin: string;
}
