// Define a constant for the mocked data when MPIN is required
export const MpinRequired = {
  message: 'MPIN is required',
  statusCode: 400,
};

// Define a constant for the mocked data when MPIN must be a 6-digit number
export const MpinFormat = {
  message: 'MPIN must be of 6-digit number',
  statusCode: 400,
};

// MockMpin is a constant object used for testing mPin-related functionalities.
// It contains mocked mPin values for correct, incorrect, and empty scenarios.
export const MockMpin = {
  correct: '123456',
  incorrect: '12345Q',
  empty: '',
};

// UserErrorMessage is a constant object used for testing error handling related to user operations.
// It contains a mocked error message and status code for when a user is not found.
export const UserErrorMessage = {
  message: 'User not found',
  statusCode: 404,
};
