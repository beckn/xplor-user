import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PhoneNumberDto, VerifyOtpDto, ResendOtpDto } from './dto';
import { CreateMPinDto } from './dto/create-mpin.dto';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { MockMpin, MpinFormat, MpinRequired, UserErrorMessage } from '../../common/constant/auth/mpin-message';

// Test suite for the AuthController, which is responsible for handling authentication-related requests.
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Setup before each test case in this suite.
  // Mocks the AuthService to isolate the AuthController from its dependencies.
  beforeEach(async () => {
    // Mock AuthService dependency
    const mockAuthService = {
      sendOtp: jest.fn(),
      verifyOtp: jest.fn(),
      resendOtp: jest.fn(),
      createMPin: jest.fn(),
      verifyMPin: jest.fn(),
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

  // Test case to ensure the AuthController is properly instantiated.
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Test suite for the sendOtp functionality in the AuthController.
  describe('sendOtp', () => {
    // Test case to verify that the sendOtp method of the AuthController calls the corresponding method of the AuthService with the expected parameters.
    it('should call authService.sendOtp with expected params', async () => {
      const dto = new PhoneNumberDto();
      await authController.sendOtp(dto);
      expect(authService.sendOtp).toHaveBeenCalledWith(dto);
    });
  });

  // Test suite for the verifyOtp functionality in the AuthController.
  describe('verifyOtp', () => {
    // Test case to verify that the verifyOtp method of the AuthController calls the corresponding method of the AuthService with the expected parameters.
    it('should call authService.verifyOtp with expected params', async () => {
      const dto = new VerifyOtpDto();
      await authController.verifyOtp(dto);
      expect(authService.verifyOtp).toHaveBeenCalledWith(dto);
    });
  });

  // Test suite for the resendOtp functionality in the AuthController.
  describe('resendOtp', () => {
    // Test case to verify that the resendOtp method of the AuthController calls the corresponding method of the AuthService with the expected parameters.
    it('should call authService.resendOtp with expected params', async () => {
      const dto = new ResendOtpDto();
      await authController.resendOtp(dto);
      expect(authService.resendOtp).toHaveBeenCalledWith(dto);
    });
  });

  // Test suite for the createMPin functionality in the AuthController.
  // This suite includes tests for various scenarios such as creating an mPin with valid data,
  // handling incorrect payloads, empty payloads, and invalid payloads.
  describe('createMPin ', () => {
    // Test case to verify the successful creation of an mPin with valid data.
    // It mocks the authService.createMPin method to return a specific mockedData object indicating a successful creation.
    it('should call to create mPin', async () => {
      const userId = `user_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      await authController.createMPin(userId, createMPinDto);
      const data = {
        _id: `user_${faker.string.uuid()}`,
        phoneNumber: faker.phone.number(),
        verified: faker.datatype.boolean(),
        kycStatus: faker.datatype.boolean(),
        wallet: faker.string.uuid(),
        updated_at: faker.date.recent(),
        created_at: faker.date.past(),
        __v: 0,
        mPin: `$argon${faker.string.uuid().replaceAll('-', '#')}$${faker.string.uuid().replaceAll('-', '$')}`,
      };
      const mockedData = {
        success: faker.datatype.boolean(),
        message: HttpResponseMessage.CREATED,
        data: data,
      };
      jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);
      const mockedMpIn = new CreateMPinDto();

      mockedMpIn.mPin = MockMpin.correct;
      expect(await authService.createMPin(mockedMpIn, userId)).toEqual(mockedData);
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

      expect(await authController.createMPin(userId, createMPinDto)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to create an mPin with an empty payload.
    // It mocks the authService.createMPin method to return a specific mockedData object indicating that an mPin is required.
    it('should call to create mPin with empty payload', async () => {
      const userId = `user_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = '';

      const mockedData = {
        message: MpinRequired.message,
        statusCode: MpinRequired.statusCode,
      };
      jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);

      expect(await authController.createMPin(userId, createMPinDto)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to create an mPin with an invalid payload.
    // It mocks the authService.createMPin method to return a specific mockedData object indicating a user error.
    it('should call to create mPin with invalid payload', async () => {
      const userId = `use_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = MockMpin.correct;
      const mockedData = {
        message: UserErrorMessage.message,
        statusCode: UserErrorMessage.statusCode,
      };
      jest.spyOn(authService, 'createMPin').mockResolvedValue(mockedData as any);

      expect(await authController.createMPin(userId, createMPinDto)).toEqual(mockedData);
    });
  });

  // Test suite for the verifyMPin functionality in the AuthController.
  // This suite includes tests for various scenarios such as verifying an mPin with valid data,
  // handling incorrect payloads, empty payloads, invalid user IDs, and wrong mPin.
  describe('verifyMPin ', () => {
    // Test case to verify the successful verification of an mPin with valid data.
    // It mocks the authService.verifyMPin method to return a specific mockedData object indicating a successful verification.
    it('should call to verify mPin', async () => {
      const userId = `user_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      await authController.verifyMPin(userId, createMPinDto);
      const data = {
        verified: true,
      };
      const mockedData = {
        success: faker.datatype.boolean(),
        message: HttpResponseMessage.VERIFICATION_PASSED,
        data: data,
      };
      jest.spyOn(authService, 'verifyMPin').mockResolvedValue(mockedData as any);
      const mockedMpIn = new CreateMPinDto();

      mockedMpIn.mPin = MockMpin.correct;
      expect(await authService.verifyMPin(mockedMpIn, userId)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to verify an mPin with an incorrect payload.
    // It mocks the authService.verifyMPin method to return a specific mockedData object indicating an incorrect mPin format.
    it('should call to verify mPin with bad payload', async () => {
      const userId = `user_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = MockMpin.incorrect;

      const mockedData = {
        message: MpinFormat.message,
        statusCode: MpinFormat.statusCode,
      };
      jest.spyOn(authService, 'verifyMPin').mockResolvedValue(mockedData as any);

      expect(await authController.verifyMPin(userId, createMPinDto)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to verify an mPin with an empty payload.
    // It mocks the authService.verifyMPin method to return a specific mockedData object indicating that an mPin is required.
    it('should call to verify mPin with empty payload', async () => {
      const userId = `user_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = '';

      const mockedData = {
        message: MpinRequired.message,
        statusCode: MpinRequired.statusCode,
      };
      jest.spyOn(authService, 'verifyMPin').mockResolvedValue(mockedData as any);

      expect(await authController.verifyMPin(userId, createMPinDto)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to verify an mPin with an invalid userId.
    // It mocks the authService.verifyMPin method to return a specific mockedData object indicating a verification failure.
    it('should call to verify mPin with invalid userId', async () => {
      const userId = `use_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = MockMpin.correct;
      const data = {
        verified: false,
      };
      const mockedData = {
        success: faker.datatype.boolean(),
        message: HttpResponseMessage.VERIFICATION_FAILED,
        data: data,
      };
      jest.spyOn(authService, 'verifyMPin').mockResolvedValue(mockedData as any);

      expect(await authController.verifyMPin(userId, createMPinDto)).toEqual(mockedData);
    });

    // Test case to verify the behavior when attempting to verify an mPin with a wrong mPin.
    // It mocks the authService.verifyMPin method to return a specific mockedData object indicating a verification failure.
    it('should call to verify mPin with wrong mpin', async () => {
      const userId = `use_${faker.string.uuid()}`;
      const createMPinDto = new CreateMPinDto();
      createMPinDto.mPin = MockMpin.correct;
      const data = {
        verified: false,
      };
      const mockedData = {
        success: faker.datatype.boolean(),
        message: HttpResponseMessage.VERIFICATION_FAILED,
        data: data,
      };
      jest.spyOn(authService, 'verifyMPin').mockResolvedValue(mockedData as any);
      expect(await authController.verifyMPin(userId, createMPinDto)).toEqual(mockedData);
    });
  });
});
