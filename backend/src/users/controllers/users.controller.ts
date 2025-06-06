import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  findAll(@Request() req?: any) {
    return this.usersService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id' })
  findOne(@Param('id') id: string, @Request() req?: any) {
    return this.usersService.findOne(id, req.user.companyId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  create(@Body() createUserDto: CreateUserDto, @Request() req?: any) {
    return this.usersService.create(createUserDto, req.user.companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req?: any) {
    return this.usersService.update(id, updateUserDto, req.user.companyId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  remove(@Param('id') id: string, @Request() req?: any) {
    return this.usersService.remove(id, req.user.companyId);
  }
}