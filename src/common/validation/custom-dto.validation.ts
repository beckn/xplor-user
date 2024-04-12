// Custom validation pipe to validate DTOs using class-validator and class-transformer.
// This pipe transforms plain JavaScript objects to class instances and validates them.
import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationMessage } from '../constant/validation/validation-message';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors), ValidationMessage.failed);
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    const formattedErrors = errors.reduce((acc, err) => {
      const firstConstraintKey = Object.keys(err.constraints)[0];
      return err.constraints[firstConstraintKey];
    }, {});
    return { message: formattedErrors, statusCode: HttpStatus.BAD_REQUEST };
  }
}
