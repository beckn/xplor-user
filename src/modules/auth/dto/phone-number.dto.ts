import { Validate } from 'class-validator';
import { CustomPhoneValidator } from '../../../common/decorator/custom-phone-validator-dto';

// DTO for handling phone number input.
// It uses a custom validator to ensure the phone number is in the correct format.
export class PhoneNumberDto {
  @Validate(CustomPhoneValidator, ['dummy', { message: '' }])
  phoneNumber: string;
}
