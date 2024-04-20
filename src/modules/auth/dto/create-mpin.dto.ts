import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { VerifyMPinValidationMessages } from '../../../common/constant/auth/verify-mpin-message';

/**
 * Data Transfer Object (DTO) for creating a Master PIN (MPIN).
 * This DTO is used to validate the MPIN input when a user is setting up or updating their MPIN.
 *
 * The DTO contains a single field:
 * - `mPin`: A string representing the user's Master PIN. It must be a 6-digit number, as enforced by the `@Matches` decorator.
 *
 * Validation rules:
 * - `mPin` must not be empty, as enforced by the `@IsNotEmpty` decorator.
 * - `mPin` must be a string, as enforced by the `@IsString` decorator.
 * - `mPin` must match the regular expression `^\d{6}$`, which ensures it is a 6-digit number.
 *
 * This DTO is used in the `createMPin` method of the `AuthService` to ensure that the MPIN provided by the user meets the required criteria.
 */
export class CreateMPinDto {
  @Matches(/^\d{6}$/, { message: 'MPIN must be of 6-digit number' })
  @IsString({ message: VerifyMPinValidationMessages.mPinMustBeString })
  @IsNotEmpty({ message: VerifyMPinValidationMessages.mPinIsRequired })
  mPin: string;
}
