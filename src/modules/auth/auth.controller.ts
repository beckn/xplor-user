import { Controller, Post, Body, Put, Get, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PhoneNumberDto, QueryOtpTypeDto, ResetMpinDto, VerifyOtpDto } from './dto';
import { Public } from '../../common/decorator/public.decorator';
import { ExtractUserId, ExtractUserIdFromToken } from '../../common/decorator/extract-userId';
import { CreateMPinDto } from './dto/create-mpin.dto';
import { ExtractToken } from '../../common/decorator/extract-token.decorator';

// This controller handles authentication-related operations such as sending OTPs, verifying OTPs, and resending OTPs.

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint to send an OTP to a phone number.
   *
   * This method is responsible for initiating the OTP sending process. It accepts a phone number as input,
   * which is provided in the request body through the `PhoneNumberDto`. The method then calls the `sendOtp`
   * method in the `AuthService` to handle the OTP sending logic. This could involve generating an OTP,
   * storing it temporarily (e.g., in Redis), and sending it to the provided phone number via SMS.
   *
   * @param createAuthDto - An object containing the phone number to which the OTP should be sent.
   * This is passed in the request body and validated against the `PhoneNumberDto` rules.
   *
   * @returns The result of the `sendOtp` method in the `AuthService`, which typically includes a success
   * message indicating that the OTP has been sent successfully.
   */
  @Public()
  @Post('send-otp')
  sendOtp(@Body() createAuthDto: PhoneNumberDto) {
    return this.authService.sendOtp(createAuthDto);
  }

  @Put('send-mpin-otp')
  sendMpinOtp(@ExtractUserId() userId: string) {
    return this.authService.sendMpinOtp(userId);
  }

  /**
   * Endpoint to verify an OTP entered by the user.
   *
   * This method is designed to handle the verification of an OTP entered by a user. It accepts the OTP
   * and the associated phone number as input, which are provided in the request body through the
   * @param verifyOtpDto - An object containing the OTP entered by the user and the associated phone number.
   * This is passed in the request body and validated against the `VerifyOtpDto` rules.
   *
   * @returns The result of the `verifyOtp` method in the `AuthService`, which includes a JWT token if the
   * OTP verification is successful, or an error message if the verification fails.
   */
  @Public()
  @Post('verify-otp')
  verifyOtp(@Query() otpType: QueryOtpTypeDto, @Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(otpType, verifyOtpDto);
  }

  /**
   * Endpoint for creating a Master PIN (MPIN) for a user.
   *
   * This method is responsible for handling the creation of a user's MPIN. It extracts the user's ID from the request,
   * validates the MPIN input against the `CreateMPinDto` rules, and then calls the `createMPin` method in the `AuthService`
   * to hash the MPIN and update the user's record in the database.
   *
   * @param userId - The ID of the user for whom the MPIN is being created. This is extracted from the request using the `@ExtractUserId()` decorator.
   * @param mPin - The Master PIN (MPIN) to be created for the user. This is passed in the request body and validated against the `CreateMPinDto` rules.
   *
   * @returns The result of the `createMPin` method in the `AuthService`, which includes the updated user record with the new MPIN hash.
   */
  @Post('create-mpin')
  createMPin(@ExtractUserId() userId: string, @Body() mPin: CreateMPinDto) {
    return this.authService.createMPin(mPin, userId);
  }

  @Put('reset-mpin')
  resetMpin(@ExtractUserId() userId: string, @Body() resetMpinDto: ResetMpinDto) {
    return this.authService.resetMpin(resetMpinDto, userId);
  }

  /**
   * Endpoint for verifying a user's Master PIN (MPIN).
   *
   * This method is designed to handle the verification of a user's MPIN. It is a critical part of the authentication
   * process, ensuring that users can securely access their accounts with their personalized pin.
   * @param userId - The ID of the user whose MPIN is being verified. This is extracted from the request using the `@ExtractUserId()` decorator.
   * @param mPin - The Master PIN (MPIN) to be verified for the user. This is passed in the request body and validated against the `CreateMPinDto` rules.
   *
   * @returns The result of the `verifyMPin` method in the `AuthService`, which includes a boolean indicating whether the MPIN verification was successful.
   * This response is used to determine if the user has successfully verified their MPIN and can proceed with accessing their account.
   */
  @Put('verify-mpin')
  verifyMPin(@ExtractUserId() userId: string, @Body() mPin: CreateMPinDto) {
    return this.authService.verifyMPin(mPin, userId);
  }

  /**
   * Endpoint for verifying a token.
   *
   * This method is designed to handle the verification of a token sent by the client. It is a critical part of the authentication
   * process, ensuring that the client has the correct permissions to access protected resources.
   * @param token - The token to be verified. This is extracted from the request headers or body, depending on the implementation.
   *
   * @returns A boolean value indicating whether the token verification was successful. This response is used to determine if the client
   * has the correct permissions to access the requested resources.
   *
   * Note: The token is already being verified if it passes the check. If the verification is successful, we simply return true.
   */
  @Get('verify-token')
  verifyToken() {
    // Token is already getting verified if it passes the check, we simply return true.
    return true;
  }

  @Public()
  @Get('refresh-token')
  getAccessToken(@ExtractUserIdFromToken() userId: string, @ExtractToken() token: string) {
    // Token is already getting verified if it passes the check, we simply return true.
    return this.authService.getAccessToken(userId, token);
  }

  @Put('logout')
  logOut(@ExtractUserId() userId: string) {
    return this.authService.logout(userId);
  }
}
