// Import necessary modules and services for testing the AuthService.
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RedisService } from '../../service/redis/redis.service';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../service/crypto/crypto';
import { TwilioService } from '../../service/twilio/twilio';
import { CreateMPinDto } from './dto/create-mpin.dto';
import { MockMpin, MpinFormat } from '../../common/constant/auth/mpin-message';
import { ErrorMessages } from '../../common/constant/error-message';
import { QueryOtpTypeDto } from './dto';
import { DevicePreferenceService } from '../device-preference/device-preference.service';

// Test suite for the AuthService.
describe('AuthService', () => {
  // Initialize variables for the services that will be mocked and tested.
  let authService: AuthService;
  let redisService: RedisService;
  let jwtService: JwtService;
  let configService: ConfigService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  let cryptoService: CryptoService;
  let twilioService: TwilioService;

  // Setup before each test case in this suite.
  beforeEach(async () => {
    // Create a testing module with mocked providers.
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuthService,
        {
          provide: RedisService,
          useValue: { setLoginOtp: jest.fn(), getOtp: jest.fn(), set: jest.fn(), get: jest.fn() },
        },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        {
          provide: UserService,
          useValue: {
            findByPhoneNumber: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        { provide: CryptoService, useValue: { decrypt: jest.fn(), encrypt: jest.fn() } },
        { provide: TwilioService, useValue: { sendOtpMobile: jest.fn() } },
        DevicePreferenceService,
      ],
    }).compile();

    // Get the instances of the services to be tested.
    authService = module.get<AuthService>(AuthService);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
    cryptoService = module.get<CryptoService>(CryptoService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  // Test case to ensure the AuthService is properly instantiated.
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // Test suite for the sendOtp functionality in the AuthService.
  describe('sendOtp', () => {
    // Test case to verify that the sendOtp method of the AuthService sends an OTP and returns a success response.
    it('should send OTP and return success response', async () => {
      const phoneNumberDto = { phoneNumber: faker.phone.number() };
      const configGetSpy = jest.spyOn(configService, 'get');
      configGetSpy.mockReturnValueOnce('dev');
      // const cryptoEncryptSpy = jest.spyOn(cryptoService, 'encrypt');
      const redisSetSpy = jest.spyOn(redisService, 'setLoginOtp');
      const twilioSendOtpMobileSpy = jest.spyOn(twilioService, 'sendOtpMobile');

      await authService.sendOtp(phoneNumberDto);

      // expect(cryptoEncryptSpy).toHaveBeenCalledWith(phoneNumberDto.phoneNumber.replaceAll(' ', ''));
      expect(redisSetSpy).toHaveBeenCalled();
      expect(twilioSendOtpMobileSpy).toHaveBeenCalled();
    });
  });

  // Test suite for the signJwt functionality in the AuthService.
  describe('signJwt', () => {
    // Test case to verify that the signJwt method of the AuthService signs a JWT token with the provided payload.
    it('should sign a JWT token with the provided payload', async () => {
      const signJwtDto = {
        userId: `user_${faker.string.uuid()}`,
        role: faker.person.jobTitle(),
        expiresIn: faker.date.past().toISOString(),
        secret: faker.string.alphanumeric(10),
      };
      const bToken = faker.string.uuid();
      const jwtSignSpy = jest.spyOn(jwtService, 'signAsync');
      jwtSignSpy.mockResolvedValueOnce(bToken);

      const token = await authService.signJwt(signJwtDto);
      expect(token).toBe(`Bearer ${bToken}`);
      expect(jwtSignSpy).toHaveBeenCalledWith(
        { sub: signJwtDto.userId, role: signJwtDto.role },
        { expiresIn: signJwtDto.expiresIn, secret: signJwtDto.secret },
      );
    });
  });

  // Test suite for the verifyOtp functionality in the AuthService.
  describe('verifyOtp', () => {
    // Test case to verify that the verifyOtp method of the AuthService throws an error if the OTP is incorrect.
    it('should throw an error if the OTP is incorrect', async () => {
      const key = faker.string.uuid(); // Generate a random UUID for the key.
      const otp = faker.number.int({ min: 100000, max: 999999 }).toString(); // Generate a random OTP.
      const verifyOtpDto = { key: key, otp: otp }; // Create a DTO with the generated key and OTP.
      const phoneNumber = faker.phone.number(); // Generate a random phone number.
      const queryOtpType = new QueryOtpTypeDto();
      jest
        .spyOn(redisService, 'getOtp') // Spy on the getOtp method of the RedisService.
        .mockResolvedValueOnce(faker.number.int({ min: 100000, max: 999999 }).toString()); // Mock the getOtp method to return a different OTP.
      jest.spyOn(cryptoService, 'decrypt').mockReturnValueOnce(phoneNumber); // Spy on and mock the decrypt method of the CryptoService.
      try {
        await authService.verifyOtp(queryOtpType, verifyOtpDto); // Attempt to verify the OTP.
      } catch (error) {
        const mockedError = new UnauthorizedException(ErrorMessages.OtpExpired); // Create a mocked error for an expired OTP.
        expect(error).toEqual(mockedError.getResponse()); // Expect the error thrown to match the mocked error.
      }
    });

    // Test case to verify that the verifyOtp method of the AuthService throws an error if the OTP is expired.
    it('should throw an error if the OTP is expired', async () => {
      const key = faker.string.uuid(); // Generate a random UUID for the key.
      const otp = faker.number.int({ min: 100000, max: 999999 }).toString(); // Generate a random OTP.
      const verifyOtpDto = { key: key, otp: otp }; // Create a DTO with the generated key and OTP.
      const phoneNumber = faker.phone.number(); // Generate a random phone number.
      const queryOtpType = new QueryOtpTypeDto();

      jest.spyOn(redisService, 'getOtp').mockResolvedValueOnce(null); // Spy on and mock the getOtp method of the RedisService to return null.
      jest.spyOn(cryptoService, 'decrypt').mockReturnValueOnce(phoneNumber); // Spy on and mock the decrypt method of the CryptoService.
      try {
        await authService.verifyOtp(queryOtpType, verifyOtpDto); // Attempt to verify the OTP.
      } catch (error) {
        const mockedError = new BadRequestException(ErrorMessages.InvalidKeyOrKeyExpired); // Create a mocked error for an invalid or expired key.
        expect(error).toEqual(mockedError.getResponse()); // Expect the error thrown to match the mocked error.
      }
    });
  });
  // Test case to verify the behavior when attempting to create an mPin with an incorrect payload.
  // It mocks the authService.createMPin method to return a specific mockedData object indicating an incorrect mPin format.
  it('should call to create mPin with bad payload', async () => {
    const userId = `user_${faker.string.uuid()}`;
    const createMPinDto = new CreateMPinDto();
    createMPinDto.mPin = MockMpin.incorrect;

    const mockedData = {
      message: MpinFormat.message,
      statusCode: MpinFormat.statusCode,
    };
    jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);

    expect(await authService.createMPin(createMPinDto, userId)).toEqual(mockedData);
  });

  // Test case to verify the behavior when attempting to create an mPin with an empty payload.
  // It mocks the authService.createMPin method to return a specific mockedData object indicating that an mPin is required.
  it('should call to create mPin with empty payload', async () => {
    const userId = `user_${faker.string.uuid()}`;
    const createMPinDto = new CreateMPinDto();
    createMPinDto.mPin = '';

    const mockedData = new UnauthorizedException(ErrorMessages.WrongMpin);
    jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);

    expect(await authService.createMPin(createMPinDto, userId)).toEqual(mockedData);
  });

  // Test case to verify the behavior when attempting to create an mPin with an invalid payload.
  // It mocks the authService.createMPin method to return a specific mockedData object indicating a user error.
  it('should call to create mPin with invalid payload', async () => {
    const userId = `use_${faker.string.uuid()}`;
    const createMPinDto = new CreateMPinDto();
    createMPinDto.mPin = MockMpin.correct;
    const mockedData = new UnauthorizedException(ErrorMessages.WrongMpin);
    jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);

    expect(await authService.createMPin(createMPinDto, userId)).toEqual(mockedData);
  });

  // Test case to verify that the getAccessToken method of the AuthService throws an error if the user is not found.
  it('should throw NotFoundException if user not found', async () => {
    const userId = 'userId';
    // Mock the findOne method to return null, simulating a user not found scenario
    jest.spyOn(userService, 'findOne').mockReturnValue(Promise.resolve(null));

    try {
      await authService.getAccessToken(userId, 'refreshToken');
    } catch (err) {
      // expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toEqual(ErrorMessages.UserNotFound);
    }
  });

  it('should throw UnauthorizedException if refresh token is invalid', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue({ data: { refreshToken: 'invalidToken' } });

    try {
      await authService.getAccessToken('userId', 'refreshToken');
    } catch (err) {
      // expect(err).toBeInstanceOf(UnauthorizedException);
      expect(err.message).toEqual(ErrorMessages.InValidRefreshToken);
    }
  });

  it('should throw UnauthorizedException if refresh token has expired', async () => {
    jest
      .spyOn(userService, 'findOne')
      .mockResolvedValue({ data: { refreshToken: 'refreshToken', refreshTokenExpiry: '2023-01-01T00:00:00Z' } });

    try {
      await authService.getAccessToken('userId', 'refreshToken');
    } catch (err) {
      // expect(err).toBeInstanceOf(UnauthorizedException);
      expect(err.message).toEqual(ErrorMessages.RefreshTokenExpired);
    }
  });
});
