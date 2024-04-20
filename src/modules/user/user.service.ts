/* eslint-disable no-console */
import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas';
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

@Injectable()
export class UserService {
  private readonly logger: Logger;
  constructor(@InjectModel('User') private UserModel: Model<User>, private roleService: RoleService) {
    this.logger = new Logger(UserService.name);
  }

  // Creates a new user with the provided phone number and sets the user as verified.
  async create(createUserDto: PhoneNumberDto): Promise<User> {
    try {
      return await this.UserModel.create({
        phoneNumber: createUserDto.phoneNumber.replaceAll(' ', ''),
        verified: true,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Creates a new user with the provided details.
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.UserModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
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
      throw new Error(error);
    }
  }

  // Retrieves a single user by ID, populating the role associated with the user.
  async findOne(id: string): Promise<User | any> {
    try {
      const user = await this.UserModel.findById(id).populate('role').exec();
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Finds a user by their phone number.
  async findByPhoneNumber(phoneNumber: string): Promise<User | any> {
    try {
      const user = await this.UserModel.findOne({ phoneNumber: phoneNumber }).exec();
      return user;
    } catch (error) {
      return error;
    }
  }

  // Updates a user's details by ID.
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true });
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
      throw new Error(error);
    }
  }

  // Deletes a user by ID.
  async remove(id: string): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndDelete(id);
      return getSuccessResponse(user, HttpResponseMessage.OK);
    } catch (error) {
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
      throw new Error(error);
    }
  }

  // Updates a user's KYC (Know Your Customer) information.
  async updateUserKyc(id: string, createKycDto: CreateKycDto): Promise<User> {
    try {
      // Logger to debug the update user kyc
      this.logger.debug('updateUserKyc ======= ', createKycDto);
      const result = await this.UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { kyc: createKycDto, kycStatus: true, wallet: createKycDto.walletId } },
        { new: true },
      );
      // Logger to debug the result in updateUserKyc
      this.logger.debug('result in updateUserKyc =======', result);
      return getSuccessResponse(result, HttpResponseMessage.OK);
    } catch (error) {
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
      // Determine and return the user's journey status based on KYC and role assignment.
      if (result[0]?.kyc && result[0]?.role && result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: true,
            roleAssigned: true,
            mPinCreated: true,
          },
          HttpResponseMessage.OK,
        );
      else if (result[0]?.kyc && !result[0]?.role && !result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: true,
            roleAssigned: false,
            mPinCreated: false,
          },
          HttpResponseMessage.OK,
        );
      else if (!result[0]?.kyc && result[0]?.role && !result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: false,
            roleAssigned: true,
            mPinCreated: false,
          },
          HttpResponseMessage.OK,
        );
      else if (!result[0]?.kyc && !result[0]?.role && result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: false,
            roleAssigned: false,
            mPinCreated: true,
          },
          HttpResponseMessage.OK,
        );
      else if (!result[0]?.kyc && !result[0]?.role && !result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: false,
            roleAssigned: false,
            mPinCreated: false,
          },
          HttpResponseMessage.OK,
        );
      else if (result[0]?.kyc && result[0]?.role && !result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: true,
            roleAssigned: true,
            mPinCreated: false,
          },
          HttpResponseMessage.OK,
        );
      else if (!result[0]?.kyc && result[0]?.role && result[0]?.mPin)
        return getSuccessResponse(
          {
            kycVerified: false,
            roleAssigned: true,
            mPinCreated: true,
          },
          HttpResponseMessage.OK,
        );
      else
        return getSuccessResponse(
          {
            kycVerified: false,
            roleAssigned: false,
            mPinCreated: false,
          },
          HttpResponseMessage.OK,
        );
    } catch (error) {
      throw new Error(error);
    }
  }

  // Updates a user's role based on the provided role ID.
  async updateUserRole(userId: string, createRoleDto: CreateRoleDto): Promise<any> {
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
  }
}
