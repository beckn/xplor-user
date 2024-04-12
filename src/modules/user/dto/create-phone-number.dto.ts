// src/user/dto/create-phone-number.dto.ts

// Importing the Validate decorator from class-validator
import { Validate } from 'class-validator';
// src/user/dto/create-phone-number.dto.ts
import { CustomPhoneValidator } from '../../../common/decorator/custom-phone-validator-dto';
import { PhoneNumberDtoMessage } from '../../../common/constant/user/dto-message';

// DTO for creating a new phone number, which includes phoneNumber field with custom validation
export class PhoneNumberDto {
  @Validate(CustomPhoneValidator, [PhoneNumberDtoMessage.Dummy, { message: '' }])
  phoneNumber: string;
}
