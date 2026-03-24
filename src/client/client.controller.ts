import {
  Controller, Get, Param, Delete, Put,
  Body, ParseIntPipe, UseGuards
} from '@nestjs/common';

import { ClientService } from './client.service';
import { Client } from '../entities/client.entity';

import {
  ApiTags, ApiParam, ApiBody,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {

  constructor(private readonly clientService: ClientService) {}

  // ================= GET ALL =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des clients' })
  findAll() {
    return this.clientService.findAll();
  }

  // ================= GET ONE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID du Client',
  })
  @ApiResponse({ status: 200, description: 'Client trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id);
  }

  // ================= UPDATE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Fedi' },
        email: { type: 'string', example: 'fedi@gmail.com' },
        password: { type: 'string', example: '934456' },
        telephone: { type: 'string', example: '22774455' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Client updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Client>,
  ) {
    return this.clientService.update(id, data);
  }

  // ================= DELETE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Client deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.remove(id);
  }
}