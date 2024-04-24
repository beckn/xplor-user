import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

import { MockKycResponse, NewUser } from '../../common/mocked/stubs/user.stub';

import { PhoneNumberGenerator } from '../../common/mocked/phone-number-generator.stub';
import { RoleService } from '../role/role.service';
import { Role } from '../role/schema/role.schema';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { ErrorPhoneMessage } from '../../common/constant/user/dto-message';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            findOneAndUpdate: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);

    userModel = module.get<Model<User>>(getModelToken(User.name));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user using phoneNumber', () => {
    it('should create a user', async () => {
      const userId = `user_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();
      const mockNewUser = new NewUser(userId, phoneNumber, true, false, null, new Date(), new Date());
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(mockNewUser as any));

      const result = await service.create({ phoneNumber: phoneNumber });
      expect(result).toEqual(mockNewUser);
    });
    it('should return bad request if phoneNumber is empty', async () => {
      const mockBadRequest = {
        message: [ErrorPhoneMessage.emptyPhoneNumber],
        error: 'Bad Request',
        statusCode: 400,
      };
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(mockBadRequest as any));

      const result = await service.create({ phoneNumber: '' });
      expect(result).toEqual(mockBadRequest);
    });
    it('should return bad request if country code is missing', async () => {
      const phoneNumber = new PhoneNumberGenerator('').generatePhoneNumber();
      const mockBadRequest = {
        message: [ErrorPhoneMessage.emptyCountryCode],
        error: HttpResponseMessage.BAD_REQUEST,
        statusCode: 400,
      };
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(mockBadRequest as any));
      const result = await service.create({ phoneNumber: phoneNumber });
      expect(result).toEqual(mockBadRequest);
    });
  });

  describe('updateUserKyc', () => {
    it('should update user kyc', async () => {
      const userId = `user_${uuidv4()}`;
      const phoneNumber = new PhoneNumberGenerator('IN').generatePhoneNumber();
      const kycDetails = {
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        gender: faker.person.gender(), // Randomly select 'Male' or 'Female' gender
        dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toString(),
        provider: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
        walletId: faker.string.uuid(),
        _id: `kyc_${faker.string.uuid()}`, // Generate a random UUID
      };
      const createKycResponse = new MockKycResponse(userId, phoneNumber, true, false, null, kycDetails);
      jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValue(createKycResponse as any);
      const result = await service.updateUserKyc(userId, kycDetails);
      expect(result['data']._id).toEqual(createKycResponse._id);
      expect(result['data'].kycStatus).toEqual(createKycResponse.kycStatus);
    });
  });

  describe('getUserJourney', () => {
    it('should get user journey', async () => {
      const userId = `user_${uuidv4()}`;
      const mockedResult = {
        data: {
          kycVerified: false,
          roleAssigned: false,
          mPinCreated: false,
        },
        message: HttpResponseMessage.OK,
        success: true,
      };
      jest.spyOn(userModel, 'aggregate').mockResolvedValue([mockedResult] as any);

      expect(await service.getUserJourney(userId)).toEqual(mockedResult);
    });
  });
});
