export const PhoneNumberDtoMessage = {
  // Message used as a placeholder or default value in validation
  Dummy: 'dummy',
};

// Define error messages related to email validation.
// These messages are used to inform the user about the outcome of their email input,
// such as when the email field is empty or when the email format is invalid.
export const EmailErrorMessage = {
  notEmptyEmail: 'email should not be empty.',
  validEmail: 'email must be a valid email.',
};

// Define error messages related to phone number validation.
// These messages are used to inform the user about the outcome of their phone number input,
// such as when the phone number field is empty, when the country code is invalid or missing,
// or when the country code field is empty.
export const ErrorPhoneMessage = {
  emptyPhoneNumber: 'Phone number should not be empty',
  invalidCountryCode: 'Please enter the country code',
  emptyCountryCode: 'Country code should not be empty',
  mustHavePhoneNumberKey: 'PhoneNumber key must be present',
  invalidPhoneNumber: 'Oops! It seems like the number you entered is invalid.',
};

// Define error messages related to user operations.
// This message is used to inform the user when a user is not found in the system.
export const ErrorUserMessage = {
  notFound: 'User not found',
  userWithPhoneNumberAlreadyExists: 'User with this phone number already exists',
};

// Define general error messages related to various validation requirements.
// These messages are used to inform the user about the outcome of their input,
// such as when a roleId field is empty or invalid, or when the gender input does not contain only letters.
export const GeneralErrorMessage = {
  emptyRoleId: 'roleId should not be empty',
  invalidRoleId: 'Invalid roleId',
  validGender: 'Gender must contain only letters',
};
