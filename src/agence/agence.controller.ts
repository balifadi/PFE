import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { AgenceService } from './agence.service';
import { Agence } from '../entities/agence.entity';
import { ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Agences')
@Controller('agences')
export class AgenceController {
  constructor(private readonly agenceService: AgenceService) {}

  // ===============================
  // ajouter agence
  // ===============================
  @Post(':clientId')
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Agence Djerba' },
        ville: { type: 'string', example: 'Djerba' },
        telephone: { type: 'string', example: '22123456' },
        latitude: { type: 'number', example: 33.8 },
        longitude: { type: 'number', example: 10.8 },
        adminId: { type: 'number', example: 1 }
      },
      required: ['nom', 'ville', 'telephone', 'adminId']
    }
  })
  @ApiResponse({ status: 201, description: 'Agence créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  create(@Body() agence: any, @Param('clientId', ParseIntPipe) clientId: number) {
    return this.agenceService.create(agence, clientId);
  }

  // ===============================
  // afficher toutes les agences
  // ===============================
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des agences' })
  findAll() {
    return this.agenceService.findAll();
  }

  // ===============================
  // afficher agence par id
  // ===============================
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Agence trouvée' })
  @ApiResponse({ status: 404, description: 'Agence non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agenceService.findOne(id);
  }

  // ===============================
  // modifier agence
  // ===============================
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Agence Djerba' },
        ville: { type: 'string', example: 'Djerba' },
        telephone: { type: 'string', example: '22123456' },
        latitude: { type: 'number', example: 33.8 },
        longitude: { type: 'number', example: 10.8 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Agence mise à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() agence: Partial<Agence>) {
    return this.agenceService.update(id, agence);
  }

  // ===============================
  // supprimer agence
  // ===============================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Agence supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agenceService.remove(id);
  }
}