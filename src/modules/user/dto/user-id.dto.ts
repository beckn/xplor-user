// src/user/dto/user-id.dto.ts

// Importing necessary decorators from class-validator
import { IsNotEmpty, IsString } from 'class-validator';

// DTO for specifying a user ID, which is used for operations that require a user's ID
export class UserIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
