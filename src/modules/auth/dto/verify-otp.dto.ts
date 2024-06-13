import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { VerifyOtpValidationMessages } from '../../../common/constant/auth/verify-otp-message';

// DTO for verifying an OTP.
// It requires a key and an OTP. The key is a string and must not be empty.
// The OTP is also a string, must not be empty, and must be exactly 6 characters long.
export class VerifyOtpDto {
  @IsNotEmpty({ message: VerifyOtpValidationMessages.KeyIsRequired })
  @IsString({ message: VerifyOtpValidationMessages.KeyMustBeString })
  key: string;

  @IsNotEmpty({ message: VerifyOtpValidationMessages.OtpIsRequired })
  @IsString({ message: VerifyOtpValidationMessages.OtpMustBeString })
  @MinLength(6, { message: VerifyOtpValidationMessages.OtpLength })
  @MaxLength(6, { message: VerifyOtpValidationMessages.OtpLength })
  otp: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}
