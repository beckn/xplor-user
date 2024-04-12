import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PhoneNumberDto, VerifyOtpDto } from './dto';
import { Public } from '../../common/decorator/public.decorator';
import { ResendOtpDto } from './dto/resend-otp.dto';

// This controller handles authentication-related operations such as sending OTPs, verifying OTPs, and resending OTPs.
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint to send an OTP to a phone number.
  @Post('send-otp')
  sendOtp(@Body() createAuthDto: PhoneNumberDto) {
    return this.authService.sendOtp(createAuthDto);
  }

  // Endpoint to verify an OTP entered by the user.
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  // Endpoint to resend an OTP to the user.
  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }
}
