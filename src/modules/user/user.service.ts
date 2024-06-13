import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { Category, CategoryModel, Domain, DomainModel, User } from './schemas';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateKycDto } from './dto/create-kyc.dto';
import { CreateRoleDto } from './dto/create-user-role-dto';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { PhoneNumberDto } from '../auth/dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from '../role/role.service';
import { ErrorUserMessage } from '../../common/constant/user/dto-message';
import { ErrorMessage } from '../../common/constant/role/service-message';
import { getUserJourneyChecks } from '../../util/get-journey-details';
import { CreateLanguageDto } from './dto/create-language.dto';
import { DOMAINS } from '../../common/constant/domains/domains';
import { CATEGORIES } from '../../common/constant/categories/categories';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger: Logger;
  constructor(
    @InjectModel('User') private UserModel: Model<User>,
    @InjectModel(DomainModel) private DomainsModel: Model<Domain>,
    @InjectModel(CategoryModel) private CategoriesModel: Model<Category>,
    private roleService: RoleService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async onModuleInit() {
    try {
      // Fetch all roles.
      const domains = await this.DomainsModel.find();
      const categories = await this.CategoriesModel.find();

      // If no roles found, initialize default roles.
      if (domains.length === 0 || categories.length == 0) {
        // Create default roles.
        await this.DomainsModel.create(DOMAINS);
        await this.CategoriesModel.create(CATEGORIES);
        this.logger.debug('domains created');
        this.logger.debug('categories created ');
      } else {
        this.logger.debug('domains exists');
        this.logger.debug('categories exists');
        // If roles exist, do nothing.
        return;
      }
    } catch (error) {
      this.logger.log('error', error);
      // Throw error if initialization fails.
      throw new Error(error);
    }
  }

  // Creates a new user with the provided phone number and sets the user as verified.
  async create(createUserDto: PhoneNumberDto): Promise<User> {
    try {
      return await this.UserModel.create({
        phoneNumber: createUserDto.phoneNumber.replaceAll(' ', ''),
        countryCode: createUserDto.countryCode || null,
        verified: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Creates a new user with the provided details.
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.UserModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      this.logger.error(error);
      if (error.code === 11000) {
        throw new ConflictException(ErrorUserMessage.userWithPhoneNumberAlreadyExists);
      }

      throw new Error(error);
    }
  }

  // Retrieves all users from the database.
  async findAll(): Promise<User[]> {
    try {
      return await this.UserModel.find().exec();
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Retrieves a single user by ID, populating the role associated with the user.
  async findOne(id: string): Promise<User | any> {
    try {
      const user = await this.UserModel.findById(id).populate('role').exec();
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async findOneUser(id: string): Promise<User | any> {
    try {
      const user: any = await this.UserModel.findById(id)
        .populate('role')
        .populate('domains')
        .populate('categories')
        .select('-refreshToken')
        .exec();
      if (!user) throw new NotFoundException(ErrorUserMessage.notFound);
      if (user.mPin) user.mPin = true;
      else user.mPin = false;
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error?.response;
    }
  }

  // Finds a user by their phone number.
  async findByPhoneNumber(phoneNumber: string): Promise<User | any> {
    try {
      const user = await this.UserModel.findOne({ phoneNumber: phoneNumber }).exec();
      return user;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  // Updates a user's details by ID.
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // this.logger.log('updateUserDto', updateUserDto);
      const user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true });
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Deletes a user by ID.
  async remove(id: string): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndDelete(id);
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Updates a user's persona with the provided interests.
  async updateUserPersona(id: string, createPersonaDto: CreatePersonaDto): Promise<User> {
    try {
      const interest = createPersonaDto.interest;
      if (interest.length != 0) {
        await this.UserModel.updateOne(
          { _id: id },
          { $push: { 'persona.interest': { $each: interest } } },
          { new: true },
        ).exec();
      }

      const user = await this.UserModel.findById(id).exec();
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Updates a user's KYC (Know Your Customer) information.
  async updateUserKyc(id: string, createKycDto: CreateKycDto): Promise<User> {
    try {
      // Logger to debug the update user kyc
      this.logger.debug({ message: createKycDto, methodName: this.updateUserKyc.name });
      const result = await this.UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { kyc: createKycDto, kycStatus: true, wallet: createKycDto.walletId } },
        { new: true },
      );
      // Logger to debug the result in updateUserKyc
      this.logger.debug({ message: result, methodName: this.updateUserKyc.name });
      return getSuccessResponse(result, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  // Retrieves the user's journey, including KYC verification and role assignment status.
  async getUserJourney(id: string): Promise<any> {
    try {
      const fields = ['kyc', 'role', 'mPin'];
      const pipeline = [
        { $match: { _id: id } }, // Match user by ID
        { $project: fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) }, // Project only specified fields
      ];
      const result = await this.UserModel.aggregate(pipeline);

      if (!result) {
        throw new NotFoundException(ErrorMessage.UserNotFound);
      } else {
        return getUserJourneyChecks(result);
      }
    } catch (error) {
      this.logger.error({ message: error, methodName: this.getUserJourney.name });
      throw error;
    }
  }

  // Updates a user's role based on the provided role ID.
  async updateUserRole(userId: string, createRoleDto: CreateRoleDto): Promise<any> {
    try {
      const role = await this.roleService.findOne(createRoleDto.roleId);
      if (role.data === null) throw new BadRequestException(ErrorMessage.inValidRole);
      const result = await this.UserModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            role: {
              _id: createRoleDto.roleId,
            },
          },
        },
        { new: true },
      )
        .populate('role')
        .exec();
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // Updates a user's language preference.
  async updateUserLanguagePrefrence(userId: string, createLanguageDto: CreateLanguageDto): Promise<any> {
    try {
      const language = await this.update(userId, createLanguageDto);

      return language;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDomains() {
    try {
      const domains = await this.DomainsModel.find();
      return getSuccessResponse(domains, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDomainByIds(domainIds: string[]) {
    try {
      const domains = await this.DomainsModel.find({ _id: { $in: domainIds } });
      return getSuccessResponse(domains, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const categories = await this.CategoriesModel.find();
      return getSuccessResponse(categories, HttpResponseMessage.OK);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
