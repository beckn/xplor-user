import { ValidationArguments } from 'class-validator';
import { faker } from '@faker-js/faker';

import { ErrorPhoneMessage } from '../../constant/user/dto-message';
import { CustomPhoneValidator } from '../custom-phone-validator-dto';
import { PhoneNumberGenerator } from '../../mocked/phone-number-generator.stub';

describe('CustomPhoneValidator', () => {
  let validator: CustomPhoneValidator;

  beforeEach(() => {
    validator = new CustomPhoneValidator();
  });

  it('should return false if value is undefined', () => {
    const args = { value: undefined } as ValidationArguments;
    expect(validator.validate(undefined, args)).toBe(false);
  });

  it('should return false if phone number is empty', () => {
    const args = { value: '' } as ValidationArguments;
    expect(validator.validate('', args)).toBe(false);
  });

  it('should return true for a valid phone number', () => {
    const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();
    const args = { value: phoneNumber } as ValidationArguments; // Replace with a valid phone number format for your test case
    expect(validator.validate(phoneNumber, args)).toBe(true);
  });

  it('should return false for an invalid phone number', () => {
    const invalid = faker.lorem.word();
    const args = { value: invalid } as ValidationArguments;
    expect(validator.validate(invalid, args)).toBe(false);
  });

  it('should provide a message for missing phone number key', () => {
    const args = { value: undefined } as ValidationArguments;
    expect(validator.defaultMessage(args)).toBe(ErrorPhoneMessage.mustHavePhoneNumberKey);
  });

  it('should provide a message for empty phone number', () => {
    const args = { value: '' } as ValidationArguments;
    expect(validator.defaultMessage(args)).toBe(ErrorPhoneMessage.emptyPhoneNumber);
  });

  it('should provide a message for missing country code', () => {
    const args = { value: faker.number.int({ min: 100000, max: 999999 }) } as ValidationArguments; // Assuming a valid number but without country code
    expect(validator.defaultMessage(args)).toBe(ErrorPhoneMessage.invalidPhoneNumber);
  });
});
