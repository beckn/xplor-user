import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { getSuccessResponse } from '../../util/getSuccessResponse';
import { HttpResponseMessage } from '../../common/enums/HttpResponseMessage';
import { Role } from './schema/role.schema';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
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

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
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
      jest.spyOn(service, 'create').mockResolvedValueOnce(getSuccessResponse(createdRole, HttpResponseMessage.OK));

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(getSuccessResponse(createdRole, HttpResponseMessage.OK));
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
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
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(getSuccessResponse(roles, HttpResponseMessage.OK));

      const result = await controller.findAll();

      expect(result).toEqual(getSuccessResponse(roles, HttpResponseMessage.OK));
    });
  });

  describe('findOne', () => {
    it('should return a specific role', async () => {
      const roleId = `role_${faker.string.uuid()}`;
      const role = {
        _id: roleId,
        type: faker.person.jobType(),
        title: faker.person.jobTitle(),
        description: faker.person.jobDescriptor(),
        imageUrl: faker.image.avatar(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(getSuccessResponse(role, HttpResponseMessage.OK));

      const result = await controller.findOne(roleId);

      expect(result).toEqual(getSuccessResponse(role, HttpResponseMessage.OK));
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const roleId = `role_${faker.string.uuid()}`;
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
      jest.spyOn(service, 'update').mockResolvedValueOnce(getSuccessResponse(updatedRole, HttpResponseMessage.OK));

      const result = await controller.update(roleId, updateRoleDto);

      expect(result).toEqual(getSuccessResponse(updatedRole, HttpResponseMessage.OK));
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      const roleId = `role_${faker.string.uuid()}`;
      jest.spyOn(service, 'remove').mockResolvedValueOnce(getSuccessResponse({ _id: roleId }, HttpResponseMessage.OK));

      const result = await controller.remove(roleId);

      expect(result).toEqual(getSuccessResponse({ _id: roleId }, HttpResponseMessage.OK));
    });
  });
});
