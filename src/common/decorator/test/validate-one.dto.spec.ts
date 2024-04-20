import { validate, IsNotEmpty } from 'class-validator';

import { ValidateOne } from '../validate-one.dto';

class TestClass {
  @ValidateOne({ message: 'Invalid input.' })
  @IsNotEmpty()
  input?: string;
}

describe('ValidateOne', () => {
  it('should pass validation when input is a valid string', async () => {
    const testInstance = new TestClass();
    testInstance.input = 'validString';

    const validationErrors = await validate(testInstance);
    expect(validationErrors.length).toBe(1);
  });

  it('should fail validation when input is an invalid email', async () => {
    const testInstance = new TestClass();
    testInstance.input = 'invalidEmail';

    const validationErrors = await validate(testInstance);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].constraints).toEqual({
      validateOne: 'Invalid input.',
    });
  });

  it('should pass validation when input is empty (due to IsNotEmpty)', async () => {
    const testInstance = new TestClass();
    testInstance.input = '';

    const validationErrors = await validate(testInstance);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].constraints).toEqual({
      isNotEmpty: 'input should not be empty',
      validateOne: 'Invalid input.',
    });
  });
});
