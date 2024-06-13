import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';

import { UserService } from './user.service';
import { PhoneNumberDto } from './dto/create-phone-number.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { CreateKycDto } from './dto/create-kyc.dto';
import { CreateRoleDto } from './dto/create-user-role-dto';
import { ExtractUserId } from '../../common/decorator/extract-userId';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../../common/decorator/public.decorator';
import { CreateLanguageDto } from './dto/create-language.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint for getting user journey
  @Get('journey')
  getUserJourney(@ExtractUserId() userId: string) {
    return this.userService.getUserJourney(userId);
  }

  // Endpoint for getting one user
  @Get('')
  findOneUser(@ExtractUserId() userId: string) {
    return this.userService.findOneUser(userId);
  }

  // Endpoint for getting all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Endpoint for updating user
  @Patch('')
  update(@ExtractUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  // Endpoint for deleting user
  @Delete('')
  remove(@ExtractUserId() userId: string) {
    return this.userService.remove(userId);
  }

  // Endpoint for updating user persona
  @Patch('/persona/')
  updateUserPersona(@ExtractUserId() userId: string, @Body() createPersonaDto: CreatePersonaDto) {
    return this.userService.updateUserPersona(userId, createPersonaDto);
  }

  // Endpoint for updating user kyc
  @Patch('/kyc/')
  updateUserKyc(@ExtractUserId() userId: string, @Body() createKycDto: CreateKycDto) {
    return this.userService.updateUserKyc(userId, createKycDto);
  }

  // Endpoint for updating user role
  @Patch('/role/')
  updateUserRole(@ExtractUserId() userId: string, @Body() createRoleDto: CreateRoleDto) {
    return this.userService.updateUserRole(userId, createRoleDto);
  }

  // Endpoint for creating phone number
  @Post()
  create(@Body() createUserDto: PhoneNumberDto) {
    return this.userService.create(createUserDto);
  }

  // Endpoint for creating user
  @Public()
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Endpoint for updating language preference
  @Patch('language-preference')
  updateUserLanguagePrefrence(@ExtractUserId() userId: string, @Body() createLanguageDto: CreateLanguageDto) {
    return this.userService.updateUserLanguagePrefrence(userId, createLanguageDto);
  }

  @Public()
  @Get('domains')
  getDomains() {
    return this.userService.getDomains();
  }

  @Public()
  @Get('categories')
  getCategories() {
    return this.userService.getCategories();
  }
}
