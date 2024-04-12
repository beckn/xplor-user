import { BadRequestException, Injectable } from '@nestjs/common';
import { PhoneNumberDto, VerifyOtpDto } from './dto';
import { generateOtp } from '../../util/generateOtp';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { RedisService } from '../../service/redis/redis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../service/crypto/crypto';
import { SignJwtDto } from './interface/signJwt.interface';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { TwilioService } from '../../service/twilio/twilio';
import { ErrorMessages } from '../../common/constant/error-message';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  constructor(
    private readonly redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private readonly twilioService: TwilioService,
  ) {
    this.jwtSecret = configService.get<string>('jwtSecret');
  }
  // Sends an OTP to the provided phone number.
  // In test environment, it uses a constant OTP; otherwise, it generates a new OTP and sends it via Twilio.
  async sendOtp(phoneNumberDto: PhoneNumberDto) {
    const env = this.configService.get('nodeEnv');
    const const_otp = this.configService.get('otp');
    const key = this.cryptoService.encrypt(phoneNumberDto.phoneNumber);
    if (env === 'test') {
      await this.redisService.setOtp(key, const_otp);
      return getSuccessResponse({ key: key, otp: const_otp }, HttpResponseMessage.OK);
    } else {
      const otp = generateOtp();

      await this.redisService.setOtp(key, otp);
      await this.twilioService.sendOtpMobile(phoneNumberDto.phoneNumber, otp);
      return getSuccessResponse({ key: key }, HttpResponseMessage.OK);
    }
  }

  // Resends an OTP to the user.
  // In test environment, it uses a constant OTP; otherwise, it generates a new OTP and sends it via Twilio.
  async resendOtp(resendOtpDto: ResendOtpDto) {
    try {
      const env = this.configService.get('nodeEnv');
      const const_otp = this.configService.get('otp');
      const key = this.cryptoService.decrypt(resendOtpDto.key);
      if (key == null) {
        throw new BadRequestException();
      }

      if (env === 'test') {
        await this.redisService.set(key, const_otp);

        return getSuccessResponse({ key: resendOtpDto.key, otp: const_otp }, HttpResponseMessage.OK);
      } else {
        const otp = generateOtp();
        await this.redisService.set(key, otp);
        await this.twilioService.sendOtpMobile(key, otp);
        return getSuccessResponse({ key: resendOtpDto.key }, HttpResponseMessage.OK);
      }
    } catch (error) {
      throw new BadRequestException(ErrorMessages.InvalidKeyOrKeyExpired);
    }
  }

  // Verifies the OTP entered by the user.
  // If the OTP is correct, it either finds or creates a user and returns a JWT token.
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const key = verifyOtpDto.key;
      const otp = verifyOtpDto.otp;

      // Use the custom getOtp method to retrieve and check the OTP
      const retrievedOtp = await this.redisService.getOtp(key);
      if (!retrievedOtp) {
        throw new BadRequestException(ErrorMessages.InvalidKeyOrKeyExpired);
      }

      if (retrievedOtp !== otp) {
        throw new BadRequestException(ErrorMessages.OtpExpired);
      }

      // If OTP is correct, proceed with user verification
      const phoneNumber = this.cryptoService.decrypt(key);
      const foundUser = await this.userService.findByPhoneNumber(phoneNumber);
      if (foundUser) {
        const token = await this.signJwt({
          userId: foundUser._id,
          role: foundUser.role,
          expiresIn: this.configService.get<string>('jwtExpiresIn'),
        });
        return getSuccessResponse({ token: token, userId: foundUser._id }, HttpResponseMessage.OK);
      } else {
        const createdUser = await this.userService.create({
          phoneNumber,
        });
        const token = await this.signJwt({
          userId: createdUser._id,
          role: createdUser.role,
          expiresIn: this.configService.get<string>('jwtExpiresIn'),
        });
        return getSuccessResponse({ token: token, userId: createdUser._id }, HttpResponseMessage.OK);
      }
    } catch (error) {
      return error?.response;
    }
  }

  // Signs a JWT token with the provided payload.
  async signJwt(signPayload: SignJwtDto): Promise<string> {
    const payload = {
      sub: signPayload.userId,
      role: signPayload.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: signPayload.expiresIn,
      secret: this.jwtSecret,
    });
    return `Bearer ${token}`;
  }
}
