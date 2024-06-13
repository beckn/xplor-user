// Contains error messages used across the application for various error handling scenarios.
export const ErrorMessages = {
  // Error message displayed when an invalid key is provided or the key has expired.
  InvalidKeyOrKeyExpired: 'Invalid key or key is expired',
  // Error message displayed when the OTP entered by the user is incorrect.
  OtpExpired:
    'The OTP you entered is incorrect. Please double-check the code sent to your mobile number and try again.',
  // Message displayed when a user is forbidden to access a resource.
  InvalidUser: 'Your are forbidden to access this resource',
  // Message displayed when a user is not found in the system.
  UserNotFound: 'User does not exist. Please go to get started.',
  // Message displayed when the entered MPIN is incorrect.
  WrongMpin: 'Incorrect MPIN. Please verify your entry and try again.',
  // Message displayed when the MPIN has not been set.
  MpinNotSet: 'MPIN has not been set. Please set your MPIN and try again.',
  // Message displayed when the MPIN has expired.
  InValidRefreshToken: 'Invalid refresh token',
  //   Message displayed when the MPIN has expired.
  RefreshTokenExpired: 'Refresh token has expired',
  // Message displayed when an OTP send limit is exceeded.
  OtpSendLimitExceeded: 'OTP send limit exceeded. Please try again after 1 hour.',
  // Message displayed when an OTP send limit is exceeded.
  MpinAlreadyCreated: 'MPIN already created. Please try reset Mpin.',
  // Message when MPIN is not created.
  MpinNotCreated: 'MPIN not created. Please create Mpin.',
  // Message when MPIN is incorrect.
  MpinIncorrect: 'MPIN is incorrect.',

  MpinIsEqulToOld: 'MPIN should not be same as old one.',

  InvalidKeyForUser: 'Invalid key for user',
};
