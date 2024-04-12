import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PhoneNumberDto, VerifyOtpDto, ResendOtpDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock AuthService dependency
    const mockAuthService = {
      sendOtp: jest.fn(),
      verifyOtp: jest.fn(),
      resendOtp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should call authService.sendOtp with expected params', async () => {
      const dto = new PhoneNumberDto();
      await authController.sendOtp(dto);
      expect(authService.sendOtp).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyOtp', () => {
    it('should call authService.verifyOtp with expected params', async () => {
      const dto = new VerifyOtpDto();
      await authController.verifyOtp(dto);
      expect(authService.verifyOtp).toHaveBeenCalledWith(dto);
    });
  });

  describe('resendOtp', () => {
    it('should call authService.resendOtp with expected params', async () => {
      const dto = new ResendOtpDto();
      await authController.resendOtp(dto);
      expect(authService.resendOtp).toHaveBeenCalledWith(dto);
    });
  });
});
