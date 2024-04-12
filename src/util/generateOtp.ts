// This function generates a random OTP (One-Time Password) of a specified length.
// By default, the length is set to 6, but it can be customized.
export const generateOtp = (length: number = 6): string => {
  // Generate a random number, multiply it by 10 raised to the power of (length - 1),
  // and then round it up to the nearest whole number. Convert it to a string to get the OTP.
  const otp = Math.ceil((Math.random() * length + 1) * Math.pow(10, length - 1)).toString();
  return otp;
};
