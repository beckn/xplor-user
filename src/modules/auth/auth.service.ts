import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

import { PhoneNumberDto, VerifyOtpDto } from './dto';
import { generateOtp } from '../../util/generateOtp';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { RedisService } from '../../service/redis/redis';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../service/crypto/crypto';
import { SignJwtDto } from './interface/signJwt.interface';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { TwilioService } from '../../service/twilio/twilio';
import { ErrorMessages } from '../../common/constant/error-message';
import { CreateMPinDto } from './dto/create-mpin.dto';

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
    const key = this.cryptoService.encrypt(phoneNumberDto.phoneNumber.replaceAll(' ', ''));
    if (env === 'test') {
      await this.redisService.setOtp(key, const_otp);
      return getSuccessResponse({ key: key, otp: const_otp }, HttpResponseMessage.OK);
    } else {
      const otp = generateOtp();

      await this.redisService.setOtp(key, otp);
      await this.twilioService.sendOtpMobile(phoneNumberDto.phoneNumber.replaceAll(' ', ''), otp);
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
        throw new UnauthorizedException(ErrorMessages.OtpExpired);
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
      throw error?.response;
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

  /**
   * Method to create a Master PIN (MPIN) for a user.
   *
   * This method is responsible for creating a new MPIN for a user. It first verifies if the user exists by
   * calling the `findOne` method of the `userService` with the provided `userId`. If the user does not exist,
   * it throws a `NotFoundException` indicating that the user was not found.
   *
   * If the user exists, the method proceeds to hash the provided MPIN using bcrypt with a salt rounds value
   * retrieved from the configuration service. The hashed MPIN is then stored in the user's record in the
   * database by calling the `update` method of the `userService`.
   *
   * @param createMPinDto - An object containing the MPIN to be created for the user. This is validated
   * against the `CreateMPinDto` rules to ensure it is a 6-digit number.
   * @param userId - The ID of the user for whom the MPIN is being created.
   *
   * @returns An object containing the updated user record with the new MPIN hash and a success message.
   */
  async createMPin(createMPinDto: CreateMPinDto, userId: string) {
    // verify user exist or not by phone number
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(ErrorMessages.NotFound);
    } else {
      const mPinHash = await argon.hash(createMPinDto.mPin);
      const updateUserMPin = await this.userService.update(userId, { mPin: mPinHash });
      return { ...updateUserMPin, message: HttpResponseMessage.CREATED };
    }
  }

  /**
   * Method to verify a user's Master PIN (MPIN).
   *
   * This method is designed to verify the MPIN provided by a user. It first verifies if the user exists by
   * calling the `findOne` method of the `userService` with the provided `userId`. If the user does not exist,
   * it returns a response indicating that the verification failed.
   *
   * If the user exists, the method retrieves the hashed MPIN from the user's record in the database and
   * compares it with the MPIN provided by the user using bcrypt's `compare` method. If the MPINs match,
   * it returns a success response indicating that the verification passed. If the MPINs do not match,
   * it returns a failure response indicating that the verification failed.
   *
   * @param verifyMPinDto - An object containing the MPIN to be verified for the user. This is validated
   * against the `CreateMPinDto` rules to ensure it is a 6-digit number.
   * @param userId - The ID of the user whose MPIN is being verified.
   *
   * @returns An object containing the verification result and a success or failure message.
   */
  async verifyMPin(verifyMPinDto: CreateMPinDto, userId: string) {
    // verify user exist or not by phone number
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException(ErrorMessages.NotFound);
      } else {
        const hashedMPin = user?.data.mPin;
        const result = await argon.verify(hashedMPin, verifyMPinDto.mPin);
        if (result) {
          return getSuccessResponse({ verified: result }, HttpResponseMessage.VERIFICATION_PASSED);
        } else {
          throw new UnauthorizedException(ErrorMessages.WrongMpin);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
