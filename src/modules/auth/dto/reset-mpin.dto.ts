import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { VerifyMPinValidationMessages } from '../../../common/constant/auth/verify-mpin-message';

export class ResetMpinDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @Matches(/^\d{6}$/, { message: 'MPIN must be of 6-digit number' })
  @IsString({ message: VerifyMPinValidationMessages.mPinMustBeString })
  @IsNotEmpty({ message: VerifyMPinValidationMessages.mPinIsRequired })
  mPin: string;
}
