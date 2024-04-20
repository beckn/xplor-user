import { IsNotEmpty, IsString } from 'class-validator';

import { KeyValidationMessages } from '../../../common/constant/auth/resend-otp-message';

// DTO for resending an OTP.
// It requires a key, which is a string and must not be empty, to identify the user.
export class ResendOtpDto {
  @IsNotEmpty({ message: KeyValidationMessages.IsNotEmpty })
  @IsString({ message: KeyValidationMessages.IsString })
  key: string;
}
