import { registerDecorator, ValidationOptions, ValidationArguments, isString, isEmail } from 'class-validator';
import { ValidateOneMessage } from '../constant/validate-one-message';

// Custom decorator to validate that at least one of the properties is valid.
// Useful for scenarios where you need to ensure that at least one of multiple fields is provided and valid.
export function ValidateOne(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: ValidateOneMessage.Name,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (isString(value) && !isEmail(value)) {
            return false;
          } else if (!args) {
            return true;
          } else {
            return true;
          }
        },
        defaultMessage(args: ValidationArguments) {
          if (args.value === '') {
            return `${args.property} ${ValidateOneMessage.IsNotEmpty}`;
          }

          if (args.value.length > 3) {
            return `${args.property} ${ValidateOneMessage.IsValidEmail}`;
          }

          return `${args.property} ${ValidateOneMessage.IsNotValid}`;
        },
      },
    });
  };
}
