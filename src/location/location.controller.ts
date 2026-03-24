import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from '../entities/location.entity';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {

  constructor(private readonly locationService: LocationService) {}

  // créer location
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        date_debut: { type: 'string', format: 'date', example: '2026-03-20' },
        date_fin: { type: 'string', format: 'date', example: '2026-03-25' },
        statut: { type: 'string', example: 'en attente' },
        clientId: { type: 'number', example: 1 },
        agenceManagerId: { type: 'number', example: 1 },
        voitureId: { type: 'number', example: 1 },
      },
      required: ['date_debut', 'date_fin', 'clientId', 'agenceManagerId', 'voitureId']
    }
  })
  @ApiResponse({ status: 201, description: 'Location créée avec succès' })
  create(@Body() location: any) {
    return this.locationService.create(location);
  }

  // confirmer location
  @Patch('confirmer/:id/:clientId')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Location confirmée' })
  confirmer(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.locationService.confirmerLocation(id, clientId);
  }

  // annuler location
  @Patch('annuler/:id/:clientId')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Location annulée' })
  annuler(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.locationService.annulerLocation(id, clientId);
  }

  // afficher toutes les locations
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des locations' })
  findAll() {
    return this.locationService.findAll();
  }

  // afficher location par id
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Location trouvée' })
  @ApiResponse({ status: 404, description: 'Location non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  // supprimer location
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Location supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}