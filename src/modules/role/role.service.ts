// Service responsible for managing roles in the application.
// Implements the OnModuleInit interface to perform initialization tasks when the module is initialized.
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { DefaultRole } from '../../common/constant/role/service-message';

@Injectable()
export class RoleService implements OnModuleInit {
  // Logger instance for logging messages.
  private readonly logger;

  // Injects the Role model from Mongoose.
  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {
    this.logger = new Logger(RoleService.name);
  }

  // Method called when the module is initialized.
  async onModuleInit() {
    try {
      // Fetch all roles.
      const roles = await this.findAll();
      // If no roles found, initialize default roles.
      if (roles?.data?.length === 0) {
        // Define default roles according to CreateRoleDto.
        const defaultRoles = DefaultRole;
        // Create default roles.
        await this.roleModel.create(defaultRoles);
      } else {
        // If roles exist, do nothing.
        return;
      }
    } catch (error) {
      this.logger.error(error);
      // Throw error if initialization fails.
      throw new Error(error);
    }
  }

  // Method to create a new role.
  async create(createRoleDto: CreateRoleDto): Promise<any> {
    // Create role based on provided DTO.
    const role = await this.roleModel.create(createRoleDto);
    // Return success response with the created role.
    return getSuccessResponse(role, HttpResponseMessage.OK);
  }

  // Method to fetch all roles.
  async findAll(): Promise<any> {
    // Find all roles from the database.
    const roles = await this.roleModel.find();
    // Return success response with the fetched roles.
    return getSuccessResponse(roles, HttpResponseMessage.OK);
  }

  // Method to fetch a specific role by its ID.
  async findOne(id: string): Promise<any> {
    // Find a role by its ID.
    const role = await this.roleModel.findById(id);
    // Return success response with the fetched role.
    return getSuccessResponse(role, HttpResponseMessage.OK);
  }

  // Method to update a role.
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Find and update the role by its ID.
    const role = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true });
    // Return success response with the updated role.
    return getSuccessResponse(role, HttpResponseMessage.OK);
  }

  // Method to delete a role.
  async remove(id: string): Promise<any> {
    const role = await this.roleModel.findByIdAndDelete(id);
    return getSuccessResponse(role, HttpResponseMessage.OK);
  }
}
