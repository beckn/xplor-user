// src/role/dto/create-role.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

// The CreateRoleDto class defines the structure for creating a new role.
export class CreateRoleDto {
  // The type of the role, which is a required string.
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  // The title of the role, which is a required string.
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  // The description of the role, which is a required string.
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  // The URL of the image associated with the role, which is a required string.
  @IsString()
  @IsNotEmpty()
  readonly imageUrl: string;
}
