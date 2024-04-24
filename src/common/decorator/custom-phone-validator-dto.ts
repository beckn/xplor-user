import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

import { PhoneValidatorErrorMessages } from '../constant/custom-phone-validator-message';

// Custom validator for phone numbers using the libphonenumber-js library.
// Ensures that the phone number is in a valid format.
@ValidatorConstraint({ name: 'customPhone', async: false })
export class CustomPhoneValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    try {
      if (args && args.value !== undefined) {
        if (args.value.length < 16 && args.value.length > 6 && args.value.includes('+')) {
          args.value.includes('+');
          return true;
        } else {
          return isValidPhoneNumber(value);
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    if (args.value === undefined) {
      return PhoneValidatorErrorMessages.IsKeyPresentErrorMessage;
    } else {
      if (args.value === '') {
        return PhoneValidatorErrorMessages.IsEmptyErrorMessage;
      } else if (!/\+/.test(args.value)) {
        return PhoneValidatorErrorMessages.IsCountryCodePresentErrorMessage;
      } else if (!/^-\d+$/.test(args.value) && !/^\+\d+/.test(args.value)) {
        return PhoneValidatorErrorMessages.IsInvalidPhoneNumberErrorMessage;
      } else {
        return PhoneValidatorErrorMessages.IsInvalidPhoneNumberErrorMessage;
      }
    }
  }
}
