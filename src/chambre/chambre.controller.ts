import {
  Controller, Get, Post, Body, Param, Delete, Put, Query, ParseIntPipe
} from '@nestjs/common';
import { ChambreService } from './chambre.service';
import { Chambre } from '../entities/chambre.entity';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Chambres')
@Controller('chambres')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  // créer chambre
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 101 },
        capacite: { type: 'number', example: 2 },
        etat: { type: 'string', example: 'libre' },
        prix_Nuit: { type: 'number', example: 80 },
        hotelId: { type: 'number', example: 1 },
        hotelManagerId: { type: 'number', example: 1 },
        reservationId: { type: 'number', example: 1 },
      },
      required: ['numero', 'capacite', 'etat', 'prix_Nuit', 'hotelId']
    }
  })
  @ApiResponse({ status: 201, description: 'Chambre créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  create(@Body() chambre: any) {
    return this.chambreService.create(chambre);
  }

  // lister toutes les chambres
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des chambres' })
  findAll() {
    return this.chambreService.findAll();
  }

  // chambre par ID
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Chambre trouvée' })
  @ApiResponse({ status: 404, description: 'Chambre non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chambreService.findOne(id);
  }

  // mettre à jour chambre
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        numero: { type: 'number', example: 102 },
        capacite: { type: 'number', example: 3 },
        etat: { type: 'string', example: 'occupée' },
        prix_Nuit: { type: 'number', example: 85 },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Chambre mise à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Chambre>) {
    return this.chambreService.update(id, data);
  }

  // supprimer chambre
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Chambre supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chambreService.remove(id);
  }

  // vérifier disponibilité chambre
  @Get(':id/disponibilite')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiQuery({ name: 'dateDebut', type: String, example: '2026-03-20' })
  @ApiQuery({ name: 'dateFin', type: String, example: '2026-03-25' })
  @ApiResponse({ status: 200, description: 'Disponibilité vérifiée' })
  verifierDisponibilite(
    @Param('id', ParseIntPipe) id: number,
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.chambreService.verifierDisponibilite(
      id,
      new Date(dateDebut),
      new Date(dateFin),
    );
  }
}