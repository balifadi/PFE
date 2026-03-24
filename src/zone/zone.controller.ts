import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { Zone } from '../entities/zone.entity';
import { ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Zones')
@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  // ===============================
  // ajouter zone touristique
  // ===============================
  @Post(':clientId')
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Djerba' },
        ville: { type: 'string', example: 'Djerba' },
        description: { type: 'string', example: 'Zone touristique magnifique' },
        imagePath: { type: 'string', example: 'image.jpg' },
        latitude: { type: 'number', example: 33.8076 },
        longitude: { type: 'number', example: 10.8451 },
        adminId: { type: 'number', example: 1 }
      },
      required: ['nom', 'ville', 'description', 'adminId']
    }
  })
  @ApiResponse({ status: 201, description: 'Zone créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur' })
  create(
    @Body() zone: any,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.zoneService.create(zone, clientId);
  }

  // ===============================
  // afficher toutes les zones
  // ===============================
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des zones' })
  findAll() {
    return this.zoneService.findAll();
  }

  // ===============================
  // afficher zone par id
  // ===============================
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Zone trouvée' })
  @ApiResponse({ status: 404, description: 'Zone non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.findOne(id);
  }

  // ===============================
  // modifier zone
  // ===============================
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Djerba' },
        ville: { type: 'string', example: 'Djerba' },
        description: { type: 'string', example: 'Updated zone' },
        imagePath: { type: 'string', example: 'image.jpg' },
        latitude: { type: 'number', example: 33.8 },
        longitude: { type: 'number', example: 10.8 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Zone mise à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() zone: Partial<Zone>) {
    return this.zoneService.update(id, zone);
  }

  // ===============================
  // supprimer zone
  // ===============================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Zone supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.remove(id);
  }
}