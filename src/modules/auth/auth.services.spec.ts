import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RedisService } from '../../service/redis/redis';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CryptoService } from '../../service/crypto/crypto';
import { TwilioService } from '../../service/twilio/twilio';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let authService: AuthService;
  let redisService: RedisService;
  let jwtService: JwtService;
  let configService: ConfigService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  let cryptoService: CryptoService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: RedisService, useValue: { setOtp: jest.fn(), getOtp: jest.fn(), set: jest.fn(), get: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: UserService, useValue: { findByPhoneNumber: jest.fn() } },
        { provide: CryptoService, useValue: { decrypt: jest.fn(), encrypt: jest.fn() } },
        { provide: TwilioService, useValue: { sendOtpMobile: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
    cryptoService = module.get<CryptoService>(CryptoService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should send OTP and return success response', async () => {
      const phoneNumberDto = { phoneNumber: faker.phone.number() };
      const configGetSpy = jest.spyOn(configService, 'get');
      configGetSpy.mockReturnValueOnce('dev');
      const cryptoEncryptSpy = jest.spyOn(cryptoService, 'encrypt');
      const redisSetSpy = jest.spyOn(redisService, 'setOtp');
      const twilioSendOtpMobileSpy = jest.spyOn(twilioService, 'sendOtpMobile');

      await authService.sendOtp(phoneNumberDto);

      expect(configGetSpy).toHaveBeenCalledWith('nodeEnv');
      expect(configGetSpy).toHaveBeenCalledWith('otp');
      expect(cryptoEncryptSpy).toHaveBeenCalledWith(phoneNumberDto.phoneNumber);
      expect(redisSetSpy).toHaveBeenCalled();
      expect(twilioSendOtpMobileSpy).toHaveBeenCalled();
    });
  });

  describe('resendOtp', () => {
    it('should resend OTP and return success response', async () => {
      const resendOtpDto = { key: 'encryptedKey' };
      const configGetSpy = jest.spyOn(configService, 'get');
      configGetSpy.mockReturnValueOnce('dev');
      const cryptoDecryptSpy = jest.spyOn(cryptoService, 'decrypt');
      cryptoDecryptSpy.mockReturnValueOnce('phoneNumber');
      const redisSetSpy = jest.spyOn(redisService, 'set');
      const twilioSendOtpMobileSpy = jest.spyOn(twilioService, 'sendOtpMobile');

      await authService.resendOtp(resendOtpDto);

      expect(configGetSpy).toHaveBeenCalledWith('nodeEnv');
      expect(configGetSpy).toHaveBeenCalledWith('otp');
      expect(cryptoDecryptSpy).toHaveBeenCalledWith('encryptedKey');
      expect(redisSetSpy).toHaveBeenCalled();
      expect(twilioSendOtpMobileSpy).toHaveBeenCalled();
    });
  });
  describe('signJwt', () => {
    it('should sign a JWT token with the provided payload', async () => {
      const signJwtDto = {
        userId: 'user_123',
        role: 'user',
        expiresIn: '1h',
      };
      const jwtSignSpy = jest.spyOn(jwtService, 'signAsync');
      jwtSignSpy.mockResolvedValueOnce('generatedToken');

      const token = await authService.signJwt(signJwtDto);
      expect(token).toBe('Bearer generatedToken');
      expect(jwtSignSpy).toHaveBeenCalledWith(
        { sub: signJwtDto.userId, role: signJwtDto.role },
        { expiresIn: signJwtDto.expiresIn },
      );
    });
  });
  describe('verifyOtp', () => {
    it('should throw an error if the OTP is incorrect', async () => {
      const verifyOtpDto = { key: 'encryptedKey', otp: '123456' };
      jest.spyOn(redisService, 'getOtp').mockResolvedValueOnce('654321');
      jest.spyOn(cryptoService, 'decrypt').mockReturnValueOnce('phoneNumber');

      const result = await authService.verifyOtp(verifyOtpDto);
      expect(result).toEqual({
        error: 'Bad Request',
        message:
          'The OTP you entered is incorrect. Please double-check the code sent to your mobile number and try again.',
        statusCode: 400,
      });
    });

    it('should throw an error if the OTP is expired', async () => {
      const verifyOtpDto = { key: 'encryptedKey', otp: '123456' };
      jest.spyOn(redisService, 'getOtp').mockResolvedValueOnce(null);
      jest.spyOn(cryptoService, 'decrypt').mockReturnValueOnce('phoneNumber');

      const result = await authService.verifyOtp(verifyOtpDto);
      expect(result).toEqual({
        error: 'Bad Request',
        message: 'Invalid key or key is expired',
        statusCode: 400,
      });
    });
  });
});
