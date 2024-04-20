// src/user/dto/update-user.dto.ts

// Importing necessary decorators from @nestjs/mapped-types and the CreateUserDto for partial updates
import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

// DTO for updating an existing user, which extends CreateUserDto for partial updates
export class UpdateUserDto extends PartialType(CreateUserDto) {}
