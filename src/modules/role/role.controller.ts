import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  // Injecting the RoleService into the controller
  constructor(private readonly roleService: RoleService) {}

  // Endpoint for creating a new role
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    // Delegating the creation logic to the RoleService
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    // Delegating the retrieval logic to the RoleService
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Delegating the retrieval logic to the RoleService
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    // Delegating the update logic to the RoleService
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Delegating the deletion logic to the RoleService
    return this.roleService.remove(id);
  }
}
