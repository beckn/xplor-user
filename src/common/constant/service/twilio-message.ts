export const SmsMessages = {
  // Message for sending OTP to the user
  OtpMessage: (otp: string) => `Login otp for your Xplor Account is ${otp}, this message will expire in 5 mins`,
  OtpSendFailedInvalidPhoneNumber: 'Failed to send OTP, Invalid phone number',
  // Message displayed when OTP sending fails due to an internal server error
  OtpSendFailedInternalServerError: 'Failed to send OTP',
};
