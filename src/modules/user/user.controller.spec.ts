import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { getModelToken } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

import { User } from './schemas';
import { RoleService } from '../role/role.service';
import { Role } from '../role/schema/role.schema';
import { PhoneNumberGenerator } from '../../common/mocked/phone-number-generator.stub';

import { MockKycResponse, MockRoleResponse } from '../../common/mocked/stubs/user.stub';
import { faker } from '@faker-js/faker';
describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            findOneAndUpdate: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            updateUserKyc: jest.fn(),
            updateUserRole: jest.fn(),
            getUserJourney: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('create user at controller level', () => {
    it('should create a user', async () => {
      const userId = `user_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();
      const createUserDto = { phoneNumber: phoneNumber };

      const mockUser = {
        _id: userId,
        phoneNumber: createUserDto.phoneNumber,
        verified: true,
      };

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser as User);

      expect(await controller.create(createUserDto)).toEqual(mockUser);
    });
    it('should return bad request if phoneNumber is empty', async () => {
      const mockBadRequest = {
        message: ['Phone number should not be empty.'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'create').mockImplementationOnce(() => Promise.resolve(mockBadRequest as any));

      const result = await controller.create({ phoneNumber: '' });
      expect(result).toEqual(mockBadRequest);
    });
    it('should return bad request if country code is missing', async () => {
      const phoneNumber = new PhoneNumberGenerator('').generatePhoneNumber();
      const mockBadRequest = {
        message: ['Please enter the country code'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'create').mockImplementationOnce(() => Promise.resolve(mockBadRequest as any));
      const result = await controller.create({ phoneNumber: phoneNumber });
      expect(result).toEqual(mockBadRequest);
    });
    it('should return bad request if country code is missing', async () => {
      const phoneNumber = new PhoneNumberGenerator('').generatePhoneNumber();
      const mockBadRequest = {
        message: ['Please enter the country code'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'create').mockImplementationOnce(() => Promise.resolve(mockBadRequest as any));
      const result = await controller.create({ phoneNumber: phoneNumber });
      expect(result).toEqual(mockBadRequest);
    });
  });
  describe('find user at controller level', () => {
    it('should find a user with correct id', async () => {
      const userId = `user_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('').generatePhoneNumber();
      const createUserDto = { phoneNumber: phoneNumber };

      const mockUser = {
        _id: userId,
        phoneNumber: createUserDto.phoneNumber,
        verified: true,
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser as User);

      expect(await controller.findOne(userId)).toEqual(mockUser);
    });
    it('should find a user with wrong id', async () => {
      const userId = `user_${uuidv4()}`;
      const mockUser = {
        message: 'User Not Found',
        error: 'Not Found',
        statusCode: 404,
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      expect(await controller.findOne(userId)).toEqual(mockUser);
    });
  });

  describe('Update user with Kyc details at controller level', () => {
    it('should Update a user with proper payload', async () => {
      const userId = `user_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();
      const kycDetails = {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        gender: faker.person.gender(), // Randomly select 'Male' or 'Female' gender
        provider: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
        _id: `kyc_${faker.string.uuid()}`, // Generate a random UUID
      };
      const mockResponse = new MockKycResponse(userId, phoneNumber, true, false, null, kycDetails);
      jest.spyOn(userService, 'updateUserKyc').mockResolvedValue(mockResponse as User);
      expect(await controller.updateUserKyc(userId, kycDetails)).toEqual(mockResponse);
    });
    it('should Update a user with bad payload empty email', async () => {
      const userId = `user_${uuidv4()}`;
      const kycDetails = {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        address: faker.location.streetAddress(),
        email: '',
        gender: faker.person.gender(), // Randomly select 'Male' or 'Female' gender
        provider: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
        _id: `role_${faker.string.uuid()}`, // Generate a random UUID
      };
      const mockResponse = {
        message: ['email should not be empty.'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'updateUserKyc').mockResolvedValue(mockResponse as any);
      expect(await controller.updateUserKyc(userId, kycDetails)).toEqual(mockResponse);
    });
    it('should Update a user with bad payload invalid email', async () => {
      const userId = `user_${uuidv4()}`;
      const kycDetails = {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        address: faker.location.streetAddress(),
        email: faker.person.fullName(),
        gender: faker.person.gender(), // Randomly select 'Male' or 'Female' gender
        provider: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
        _id: `role_${faker.string.uuid()}`, // Generate a random UUID
      };
      const mockResponse = {
        message: ['email must be a valid email.'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'updateUserKyc').mockResolvedValue(mockResponse as any);
      expect(await controller.updateUserKyc(userId, kycDetails)).toEqual(mockResponse);
    });
    it('should Update a user with bad payload invalid gender', async () => {
      const userId = `user_${uuidv4()}`;
      const kycDetails = {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        gender: faker.number.int().toString(), // Randomly select 'Male' or 'Female' gender
        provider: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
        _id: `role_${faker.string.uuid()}`, // Generate a random UUID
      };
      const mockResponse = {
        message: ['Gender must contain only letters'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'updateUserKyc').mockResolvedValue(mockResponse as any);
      expect(await controller.updateUserKyc(userId, kycDetails)).toEqual(mockResponse);
    });
  });

  describe('Update user with role id at controller level', () => {
    it('should Update a user  role with valid roleId', async () => {
      const userId = `user_${uuidv4()}`;
      const roleId = `role_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();

      const mockResponse = new MockRoleResponse(userId, phoneNumber, true, false, null, roleId);
      jest.spyOn(userService, 'updateUserRole').mockResolvedValue(mockResponse as User);
      expect(await controller.updateUserRole(userId, { roleId: roleId })).toEqual(mockResponse);
    });
    it('should Update a user  role with incorrect roleId', async () => {
      const userId = `user_${uuidv4()}`;
      const roleId = `roe_${uuidv4()}`;
      const mockResponse = {
        message: 'Invalid roleId',
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'updateUserRole').mockResolvedValue(mockResponse);
      expect(await controller.updateUserRole(userId, { roleId: roleId })).toEqual(mockResponse);
    });
    it('should Update a user  role with empty roleId', async () => {
      const userId = `user_${uuidv4()}`;
      const roleId = `roe_${uuidv4()}`;
      const mockResponse = {
        message: ['roleId should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userService, 'updateUserRole').mockResolvedValue(mockResponse);
      expect(await controller.updateUserRole(userId, { roleId: roleId })).toEqual(mockResponse);
    });
  });

  describe('Get user journey id at controller level', () => {
    it('should get a user journey with valid userId', async () => {
      const userId = `user_${uuidv4()}`;
      const mockedResponse = {
        data: {
          kycVerified: false,
          roleAssigned: false,
        },
        message: 'OK',
        success: true,
      };
      jest.spyOn(userService, 'getUserJourney').mockResolvedValue(mockedResponse);
      expect(await controller.getUserJourney(userId)).toEqual(mockedResponse);
    });
    it('should get a user journey with wrong userId', async () => {
      const userId = `user_${uuidv4()}`;
      const mockedResponse = {
        message: 'User Not Found',
        error: 'Not Found',
        statusCode: 404,
      };
      jest.spyOn(userService, 'getUserJourney').mockResolvedValue(mockedResponse);
      expect(await controller.getUserJourney(userId)).toEqual(mockedResponse);
    });
  });
});
