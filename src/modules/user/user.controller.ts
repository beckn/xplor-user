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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('journey')
  getUserJourney(@ExtractUserId() userId: string) {
    return this.userService.getUserJourney(userId);
  }

  @Get('')
  findOne(@ExtractUserId() userId: string) {
    return this.userService.findOne(userId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch('')
  update(@ExtractUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete('')
  remove(@ExtractUserId() userId: string) {
    return this.userService.remove(userId);
  }

  @Patch('/persona/')
  updateUserPersona(@ExtractUserId() userId: string, @Body() createPersonaDto: CreatePersonaDto) {
    return this.userService.updateUserPersona(userId, createPersonaDto);
  }
  @Patch('/kyc/')
  updateUserKyc(@ExtractUserId() userId: string, @Body() createKycDto: CreateKycDto) {
    return this.userService.updateUserKyc(userId, createKycDto);
  }
  @Patch('/role/')
  updateUserRole(@ExtractUserId() userId: string, @Body() createRoleDto: CreateRoleDto) {
    return this.userService.updateUserRole(userId, createRoleDto);
  }
  @Post()
  create(@Body() createUserDto: PhoneNumberDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
