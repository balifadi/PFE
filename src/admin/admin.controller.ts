import {
  Controller, Get, Param, Delete, Put,
  Body, ParseIntPipe, UseGuards
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from '../entities/admin.entity';

import {
  ApiTags, ApiParam, ApiBody,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {

  constructor(private readonly adminService: AdminService) {}

  // ================= GET ALL =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des admins' })
  findAll() {
    return this.adminService.findAll();
  }

  // ================= GET ONE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID du Admin'
  })
  @ApiResponse({ status: 200, description: 'Admin trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  // ================= UPDATE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Super Admin' },
        email: { type: 'string', example: 'admin@gmail.com' },
        password: { type: 'string', example: '123456' },
        telephone: { type: 'string', example: '99123456' },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Admin updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Admin>,
  ) {
    return this.adminService.update(id, data);
  }

  // ================= DELETE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1
  })
  @ApiResponse({ status: 200, description: 'Admin deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}