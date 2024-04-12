// src/role/schema/role.schema.ts
// This DTO (Data Transfer Object) is used for updating an existing role in the system.
// It extends the CreateRoleDto, making all fields optional, allowing for partial updates.

import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

// The UpdateRoleDto class extends the CreateRoleDto, making all fields optional.
// This allows for partial updates of a role, enabling modifications to any subset of the role's fields.
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
