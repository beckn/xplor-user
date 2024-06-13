import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

import { PhoneNumberDto, QueryOtpTypeDto, ResetMpinDto, VerifyOtpDto } from './dto';
import { generateOtp } from '../../util/generateOtp';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { RedisService } from '../../service/redis/redis.service';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../service/crypto/crypto';
import { SignJwtDto } from './interface/signJwt.interface';
import { TwilioService } from '../../service/twilio/twilio';
import { ErrorMessages } from '../../common/constant/error-message';
import { CreateMPinDto } from './dto/create-mpin.dto';
import { getIsoString } from '../../util/getIsoString';
import OTP_TYPE from '../../common/enums/otp-type';
import { DevicePreferenceService } from '../device-preference/device-preference.service';
import { IDevicePreference } from '../device-preference/interfaces/device-preference';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private accessTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenSecret: string;
  private refreshTokenExpiry: string;
  constructor(
    private readonly redisService: RedisService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private readonly twilioService: TwilioService,
    private readonly devicePreferenceService: DevicePreferenceService,
  ) {
    this.accessTokenSecret = configService.get<string>('accessTokenSecret');
    this.accessTokenExpiry = configService.get('jwtAccessTokenExpiresIn');
    this.refreshTokenSecret = configService.get('jwtRefreshTokenSecret');
    this.refreshTokenExpiry = configService.get('jwtRefreshTokenSecretExpiresIn');
  }
  // Sends an OTP to the provided phone number.
  // In test environment, it uses a constant OTP; otherwise, it generates a new OTP and sends it via Twilio.
  async sendOtp(phoneNumberDto: PhoneNumberDto) {
    const env = this.configService.get('nodeEnv');
    const const_otp = this.configService.get('otp');
    const key = phoneNumberDto.phoneNumber.replaceAll(' ', '');
    if (phoneNumberDto.userCheck) {
      const user = await this.userService.findByPhoneNumber(phoneNumberDto.phoneNumber);
      if (!user || !user.kyc) throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    if (env === 'test') {
      await this.redisService.setLoginOtp(key, const_otp);

      return getSuccessResponse({ key: key, otp: const_otp }, HttpResponseMessage.OK);
    } else {
      const otp = generateOtp();

      await this.redisService.setLoginOtp(key, const_otp);

      await this.twilioService.sendOtpMobile(phoneNumberDto.phoneNumber.replaceAll(' ', ''), otp);
      return getSuccessResponse({ key: key }, HttpResponseMessage.OK);
    }
  }

  // Sends an OTP to the user's mobile number.
  // In test environment, it uses a constant OTP; otherwise, it generates a new OTP and sends it via Twilio.
  async sendMpinOtp(userId: string) {
    const env = this.configService.get('nodeEnv');
    const const_otp = this.configService.get('otp');
    const foundUser = await this.userService.findOne(userId);
    if (!foundUser) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    const key = this.cryptoService.encrypt(foundUser?.data?.userId || userId);
    if (env === 'test') {
      await this.redisService.setOtpMpin(key, const_otp);

      return getSuccessResponse({ mpinKey: key, otp: const_otp }, HttpResponseMessage.OK);
    } else {
      const otp = generateOtp();

      await this.redisService.setOtpMpin(key, const_otp);

      await this.twilioService.sendOtpMobile(foundUser.data?.phoneNumber.replaceAll(' ', ''), otp);
      return getSuccessResponse({ mpinKey: key }, HttpResponseMessage.OK);
    }
  }

  // Verifies the OTP entered by the user.
  // If the OTP is correct, it either finds or creates a user and returns a JWT token.
  async verifyOtp(otpType: QueryOtpTypeDto, verifyOtpDto: VerifyOtpDto) {
    try {
      const { key, otp } = verifyOtpDto;

      // Use the custom getOtp method to retrieve and check the OTP
      const retrievedOtp =
        otpType.otpType === OTP_TYPE.MPIN
          ? await this.redisService.getMpinOtp(key)
          : await this.redisService.getOtp(key);

      if (!retrievedOtp) {
        throw new BadRequestException(ErrorMessages.InvalidKeyOrKeyExpired);
      }

      if (retrievedOtp !== otp) {
        throw new UnauthorizedException(ErrorMessages.OtpExpired);
      }

      // If OTP is correct, proceed with user verification
      // const phoneNumber = this.cryptoService.decrypt(key);
      const phoneNumber = key;

      let foundUser;
      if (otpType.otpType === OTP_TYPE.MPIN) {
        const userId = this.cryptoService.decrypt(key);
        foundUser = await this.userService.findOne(userId);
      } else {
        foundUser = await this.userService.findByPhoneNumber(phoneNumber);
      }

      // verify Mpin logic

      if (otpType.otpType === OTP_TYPE.MPIN) {
        const key = this.cryptoService.encrypt(foundUser?.data?._id);
        await this.redisService.setVerifiedMpinKey(key, foundUser?.data?._id);
        await this.redisService.resetSendAttempts(key);
        return getSuccessResponse({ verifiedMpinKey: key }, HttpResponseMessage.OK);
      }

      if (foundUser) {
        let devicePreference: any;
        if (verifyOtpDto.deviceId)
          devicePreference = await this.devicePreferenceService.getDeviceInfo(verifyOtpDto.deviceId);
        const devicePreferenceData: IDevicePreference | any = devicePreference?.data;
        if (devicePreferenceData) {
          await this.userService.update(foundUser?._id, {
            languagePreference: devicePreferenceData.languageCode,
            domains: devicePreferenceData.domains,
            categories: devicePreferenceData.categories,
            role: devicePreferenceData.roleId,
          });
        }

        const authToken = await this.signJwt({
          userId: foundUser?._id,
          role: foundUser?.role,
          languageCode: foundUser?.languagePreference || 'en',
          secret: this.accessTokenSecret,
          expiresIn: this.accessTokenExpiry,
        });

        const accessTokenExp = getIsoString(this.accessTokenExpiry);
        const refreshToken = await this.signJwt({
          userId: foundUser?._id,
          role: foundUser?.role,
          secret: this.refreshTokenSecret,
          expiresIn: this.refreshTokenExpiry,
        });
        const refreshTokenExp = getIsoString(this.refreshTokenExpiry);
        await this.userService.update(foundUser._id, {
          refreshToken: refreshToken,
          accessTokenExpiry: accessTokenExp,
          refreshTokenExpiry: refreshTokenExp,
        });
        await this.redisService.resetSendAttempts(key);
        return getSuccessResponse(
          { accessToken: authToken, refreshToken: refreshToken, userId: foundUser._id },
          HttpResponseMessage.OK,
        );
      } else {
        let devicePreference: any;
        if (verifyOtpDto.deviceId)
          devicePreference = await this.devicePreferenceService.getDeviceInfo(verifyOtpDto.deviceId);

        const createdUser = await this.userService.create({
          phoneNumber,
          countryCode: verifyOtpDto.countryCode,
        });
        const devicePreferenceData: IDevicePreference | any = devicePreference?.data;
        if (devicePreferenceData) {
          await this.userService.update(createdUser?._id, {
            languagePreference: devicePreferenceData.languageCode,
            domains: devicePreferenceData.domains,
            categories: devicePreferenceData.categories,
            role: devicePreferenceData.roleId,
          });
        }

        const authToken = await this.signJwt({
          userId: createdUser._id,
          role: createdUser.role,
          languageCode: devicePreference?.languagePreference || 'en',
          secret: this.accessTokenSecret,
          expiresIn: this.accessTokenExpiry,
        });

        const accessTokenExp = getIsoString(this.accessTokenExpiry);
        const refreshToken = await this.signJwt({
          userId: createdUser._id,
          role: createdUser.role,
          secret: this.refreshTokenSecret,
          expiresIn: this.refreshTokenExpiry,
        });

        const refreshTokenExp = getIsoString(this.refreshTokenExpiry);
        await this.userService.update(createdUser._id, {
          refreshToken: refreshToken,
          accessTokenExpiry: accessTokenExp,
          refreshTokenExpiry: refreshTokenExp,
        });
        await this.redisService.resetSendAttempts(key);

        return getSuccessResponse(
          { accessToken: authToken, refreshToken: refreshToken, userId: createdUser._id },
          HttpResponseMessage.OK,
        );
      }
    } catch (error) {
      this.logger.error(error?.response);
      throw error?.response;
    }
  }

  // Signs a JWT token with the provided payload.
  async signJwt(signPayload: SignJwtDto): Promise<string> {
    const payload = {
      sub: signPayload.userId,
      role: signPayload.role,
      languageCode: signPayload.languageCode,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: signPayload.expiresIn,
      secret: signPayload.secret,
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
      throw new NotFoundException(ErrorMessages.UserNotFound);
    } else {
      if (user.data?.mPin !== null) throw new ForbiddenException(ErrorMessages.MpinAlreadyCreated);
      const mPinHash = await argon.hash(createMPinDto.mPin);
      const updateUserMPin = await this.userService.update(userId, { mPin: mPinHash });
      return getSuccessResponse(updateUserMPin, HttpResponseMessage.CREATED);
    }
  }

  async resetMpin(resetMpinDto: ResetMpinDto, userId: string) {
    // const key = await this.redisService.getMpinOtpKey(resetMpinDto.key);
    const verifiedMpinKey = await this.redisService.getVerifiedMpinKey(resetMpinDto.key);

    if (!verifiedMpinKey) throw new ForbiddenException(ErrorMessages.InvalidKeyOrKeyExpired);
    if (verifiedMpinKey !== userId) throw new ForbiddenException(ErrorMessages.InvalidKeyForUser);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    } else {
      if (user.data?.mPin === null) throw new ForbiddenException(ErrorMessages.MpinNotCreated);
      const isMatch = await argon.verify(user.data?.mPin, resetMpinDto.mPin);
      if (isMatch) throw new ForbiddenException(ErrorMessages.MpinIsEqulToOld);

      const mPinHash = await argon.hash(resetMpinDto.mPin);
      const updateUserMPin = await this.userService.update(userId, { mPin: mPinHash });
      return updateUserMPin;
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

      if (!user?.data) {
        throw new NotFoundException(ErrorMessages.UserNotFound);
      } else {
        const hashedMPin = user?.data.mPin;

        if (!hashedMPin) {
          throw new UnauthorizedException(ErrorMessages.MpinNotSet);
        }

        const result = await argon.verify(hashedMPin, verifyMPinDto.mPin);
        if (result) {
          return getSuccessResponse({ verified: result }, HttpResponseMessage.VERIFICATION_PASSED);
        } else {
          throw new UnauthorizedException(ErrorMessages.WrongMpin);
        }
      }
    } catch (error) {
      this.logger.log(error?.response);
      throw error?.response;
    }
  }

  // Method to generate a new access token using the provided refresh token.
  async getAccessToken(userId: string, refreshToken: string) {
    try {
      const foundUser = (await this.userService.findOne(userId))?.data;
      if (!foundUser) {
        throw new NotFoundException(ErrorMessages.UserNotFound);
      }

      const userRefreshToken = foundUser.refreshToken;

      // Check if the provided refresh token matches the one stored in the database
      if (userRefreshToken !== refreshToken) {
        throw new UnauthorizedException(ErrorMessages.InValidRefreshToken);
      }

      // Check if the refresh token has expired
      const currentTime = new Date();
      const userRefreshTokenExpiry = foundUser?.refreshTokenExpiry;
      if (new Date(currentTime) > new Date(userRefreshTokenExpiry)) {
        throw new UnauthorizedException(ErrorMessages.RefreshTokenExpired);
      }

      // If the refresh token is valid and not expired, generate a new access token
      const payload = {
        userId: userId,
        role: foundUser?.role,
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiry,
      };
      this.userService.update(userId, { accessTokenExpiry: getIsoString(payload.expiresIn) });
      const accessToken = await this.signJwt(payload);

      // Optionally, update the refresh token's expiry date here
      // This could involve generating a new refresh token and updating it in the database

      return getSuccessResponse({ accessToken }, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error?.response);
      throw error?.response;
    }
  }

  // Log out a user by invalidating their refresh token
  async logout(userId: string) {
    try {
      const foundUser = (await this.userService.findOne(userId))?.data;
      if (!foundUser) {
        throw new NotFoundException(ErrorMessages.UserNotFound);
      }

      // Invalidate the refresh token by setting its expiry date to a past date
      // Alternatively, you can delete the refresh token from the database
      const invalidatedRefreshTokenExpiry = new Date(0); // Unix epoch (1970-01-01T00:00:00Z)
      await this.userService.update(userId, {
        refreshTokenExpiry: invalidatedRefreshTokenExpiry.toISOString(),
      });

      return getSuccessResponse({ userId: userId }, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error?.response);
      throw error?.response;
    }
  }
}
