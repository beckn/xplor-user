import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { getModelToken } from '@nestjs/mongoose';

import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schema/role.schema';
import { faker } from '@faker-js/faker';

describe('RoleService', () => {
  let service: RoleService;
  let roleModel: Model<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken('Role'),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleModel = module.get<Model<Role>>(getModelToken('Role'));
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      const createdRole = {
        _id: `role_${faker.string.uuid()}`,
        ...createRoleDto,
      };
      jest.spyOn(roleModel, 'create').mockResolvedValueOnce(createdRole as any);

      const result = await service.create(createRoleDto);

      expect(result).toEqual(getSuccessResponse(createdRole, HttpResponseMessage.OK));
    });
    it('should throw an error if role creation fails', async () => {
      const createRoleDto: CreateRoleDto = {
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      const errorMessage = 'Role creation failed';
      jest.spyOn(roleModel, 'create').mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.create(createRoleDto)).rejects.toThrowError(errorMessage);
    });
  });

  describe('findAll', () => {
    it('should find all roles', async () => {
      const roles = [
        {
          _id: `role_${faker.string.uuid()}`,
          type: faker.person.jobType(),
          title: faker.person.jobTitle(),
          description: faker.person.jobDescriptor(),
          imageUrl: faker.image.avatar(),
        },
        {
          _id: `role_${faker.string.uuid()}`,
          type: faker.person.jobType(),
          title: faker.person.jobTitle(),
          description: faker.person.jobDescriptor(),
          imageUrl: faker.image.avatar(),
        },
      ];
      jest.spyOn(roleModel, 'find').mockResolvedValueOnce(roles as any);

      const result = await service.findAll();

      expect(result).toEqual(getSuccessResponse(roles, HttpResponseMessage.OK));
    });
  });

  describe('findOne', () => {
    it('should return a specific role', async () => {
      const roleId = `role_${uuidv4()}`;
      const role = {
        _id: roleId,
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      jest.spyOn(roleModel, 'findById').mockResolvedValueOnce(role as any);

      const result = await service.findOne(roleId);

      expect(result).toEqual(getSuccessResponse(role, HttpResponseMessage.OK));
    });

    it('should handle error if role is not found', async () => {
      const roleId = faker.string.uuid();
      jest.spyOn(roleModel, 'findById').mockResolvedValueOnce(null);

      try {
        await service.findOne(roleId);
      } catch (error) {
        expect(error.message).toBe('Role not found');
      }
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = `role_${uuidv4()}`;
      const updateRoleDto: UpdateRoleDto = {
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      const updatedRole = {
        _id: roleId,
        ...updateRoleDto,
      };
      jest.spyOn(roleModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedRole as any);

      const result = await service.update(roleId, updateRoleDto);

      expect(result).toEqual(getSuccessResponse(updatedRole, HttpResponseMessage.OK));
    });

    it('should handle error if role update fails', async () => {
      const roleId = `role_${uuidv4()}`;
      const updateRoleDto: UpdateRoleDto = {
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      jest.spyOn(roleModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Role update failed'));

      try {
        await service.update(roleId, updateRoleDto);
      } catch (error) {
        expect(error.message).toBe('Role update failed');
      }
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      const roleId = `user_${uuidv4()}`;
      jest.spyOn(roleModel, 'findByIdAndDelete').mockResolvedValueOnce({ _id: roleId } as any);

      const result = await service.remove(roleId);

      expect(result).toEqual(getSuccessResponse({ _id: roleId }, HttpResponseMessage.OK));
    });

    it('should handle error if role deletion fails', async () => {
      const roleId = `role_${uuidv4()}`;
      jest.spyOn(roleModel, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Role deletion failed'));

      try {
        await service.remove(roleId);
      } catch (error) {
        expect(error.message).toBe('Role deletion failed');
      }
    });
  });
});
