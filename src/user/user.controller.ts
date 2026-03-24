import {
  Controller, Get, Post, Body, Param, Delete, Put,
  Request, UseGuards, ParseIntPipe
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';

import {
  ApiTags, ApiBody, ApiParam,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // ================= REGISTER =================
  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nom','email','password','telephone','role'],
      properties: {
        nom: { type: 'string', example: 'Mehdi' },
        email: { type: 'string', example: 'mehdi@gmail.com' },
        password: { type: 'string', example: '123456' },
        telephone: { type: 'string', example: '22334455' },
        role: { type: 'string', example: 'client' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  register(@Body() body: Partial<User>) {
    return this.userService.register(body);
  }

  // ================= LOGIN =================
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email','password'],
      properties: {
        email: { type: 'string', example: 'mehdi@gmail.com' },
        password: { type: 'string', example: '123456' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'JWT Token',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  async login(@Body() body: { email: string; password: string }) {

    const user = await this.userService.validateUser(
      body.email,
      body.password,
    );

    return this.userService.login(user);
  }

  // ================= PROFILE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur',
    schema: {
      example: {
        iduser: 1,
        nom: 'Mehdi',
        email: 'mehdi@gmail.com',
        telephone: '22334455',
        role: 'Client'
      }
    }
  })
  async getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.iduser);
  }

  // ================= GET ALL =================
  @Get()
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.userService.findAll();
  }

  // ================= GET ONE =================
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Single user' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // ================= UPDATE =================
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        telephone: { type: 'string' },
        role: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }

  // ================= DELETE =================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}