import {
  Controller, Get, Param, Delete, Put,
  Body, ParseIntPipe, UseGuards
} from '@nestjs/common';

import { HotelManagerService } from './hotel-manager.service';
import { HotelManager } from '../entities/hotel-manager.entity';

import {
  ApiTags, ApiParam, ApiBody,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('HotelManagers')
@Controller('hotel-managers')
export class HotelManagerController {

  constructor(private readonly hotelManagerService: HotelManagerService) {}

  // ================= GET ALL =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des hotel managers' })
  findAll() {
    return this.hotelManagerService.findAll();
  }

  // ================= GET ONE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID du Hotel Manager'
  })
  @ApiResponse({ status: 200, description: 'Hotel Manager trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelManagerService.findOne(id);
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
        nom: { type: 'string', example: 'Ahmed' },
        email: { type: 'string', example: 'ahmed@gmail.com' },
        password: { type: 'string', example: '123456' },
        telephone: { type: 'string', example: '99887766' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Hotel Manager updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<HotelManager>,
  ) {
    return this.hotelManagerService.update(id, data);
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
  @ApiResponse({ status: 200, description: 'Hotel Manager deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelManagerService.remove(id);
  }
}