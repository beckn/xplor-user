// Importing necessary decorators from class-validator
import { IsNotEmpty, IsString } from 'class-validator';

// DTO for creating a new user role, which includes roleId field
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  readonly roleId: string;
}
