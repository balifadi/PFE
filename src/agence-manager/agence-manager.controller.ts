import {
  Controller, Get, Param, Delete, Put,
  Body, ParseIntPipe, UseGuards
} from '@nestjs/common';

import { AgenceManagerService } from './agence-manager.service';
import { AgenceManager } from '../entities/agence-manager.entity';

import {
  ApiTags, ApiParam, ApiBody,
  ApiResponse, ApiBearerAuth
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AgenceManagers')
@Controller('agence-managers')
export class AgenceManagerController {

  constructor(private readonly agenceManagerService: AgenceManagerService) {}

  // ================= GET ALL =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des agence managers' })
  findAll() {
    return this.agenceManagerService.findAll();
  }

  // ================= GET ONE =================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID du Agence Manager'
  })
  @ApiResponse({ status: 200, description: 'Agence Manager trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agenceManagerService.findOne(id);
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
        nom: { type: 'string', example: 'Sami' },
        email: { type: 'string', example: 'sami@gmail.com' },
        password: { type: 'string', example: '123456' },
        telephone: { type: 'string', example: '88776655' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Agence Manager updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<AgenceManager>,
  ) {
    return this.agenceManagerService.update(id, data);
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
  @ApiResponse({ status: 200, description: 'Agence Manager deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agenceManagerService.remove(id);
  }
}