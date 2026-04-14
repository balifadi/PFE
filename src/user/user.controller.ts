import {
  Controller, Get, Post, Body, Param, Delete, Put,
  Request, UseGuards, ParseIntPipe, UsePipes, ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ================= REGISTER =================
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: LoginResponseDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.register(createUserDto);
    const access_token = this.userService.generateToken(user as any);
    return { ...user, access_token, role: user.role as 'admin' | 'client' | 'hotel-manager' | 'agence-manager' };
  }

  // ================= LOGIN =================
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login success', type: LoginResponseDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.userService.login(loginUserDto);
  }


  // ================= ADMIN ONLY =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req: any) {
    return this.userService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.userService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.userService.remove(id, req.user);
  }

  // ================= GET USERS BY ROLE =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get('role/:role')
  async getUsersByRole(@Param('role') role: string, @Request() req: any) {
    return this.userService.findUsersByRole(role, req.user);
  }

  // ================= GET SINGLE USER BY ROLE AND ID =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get('role/:role/:id')
  async getUserByRoleAndId(@Param('role') role: string, @Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.userService.findUserByRoleAndId(role, id, req.user);
  }
}