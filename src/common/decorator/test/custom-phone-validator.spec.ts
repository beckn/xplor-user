import { CustomPhoneValidator } from '../custom-phone-validator-dto';
import { ValidationArguments } from 'class-validator';

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
    const args = { value: '+919934567890' } as ValidationArguments; // Replace with a valid phone number format for your test case
    expect(validator.validate('+919934567890', args)).toBe(true);
  });

  it('should return false for an invalid phone number', () => {
    const args = { value: 'invalid' } as ValidationArguments;
    expect(validator.validate('invalid', args)).toBe(false);
  });

  it('should provide a message for missing phone number key', () => {
    const args = { value: undefined } as ValidationArguments;
    expect(validator.defaultMessage(args)).toBe('PhoneNumber key must be present');
  });

  it('should provide a message for empty phone number', () => {
    const args = { value: '' } as ValidationArguments;
    expect(validator.defaultMessage(args)).toBe('Phone number should not be empty.');
  });

  it('should provide a message for missing country code', () => {
    const args = { value: '1234567890' } as ValidationArguments; // Assuming a valid number but without country code
    expect(validator.defaultMessage(args)).toBe('Oops! It seems like the number you entered is invalid.');
  });
});
