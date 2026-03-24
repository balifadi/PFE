import {
  Controller, Get, Post, Body, Param, Delete, Put, Query, ParseIntPipe
} from '@nestjs/common';
import { VoitureService } from './voiture.service';
import { Voiture } from '../entities/voiture.entity';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery   // ✅ لازم تضيفها هنا
} from '@nestjs/swagger';

@ApiTags('Voitures')
@Controller('voitures')
export class VoitureController {
  constructor(private readonly voitureService: VoitureService) {}

  // ===============================
  // créer voiture
  // ===============================
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        marque: { type: 'string', example: 'Toyota' },
        modele: { type: 'string', example: 'Corolla' },
        immatriculation: { type: 'string', example: 'TN-123-456' },
        etat: { type: 'string', example: 'neuf' },
        prix_Jour: { type: 'number', example: 50 },
        agenceId: { type: 'number', example: 1 },
        agenceManagerId: { type: 'number', example: 1 },
        locationId: { type: 'number', example: 1 },
      },
      required: ['marque', 'modele', 'immatriculation', 'etat', 'prix_Jour', 'agenceId']
    }
  })
  @ApiResponse({ status: 201, description: 'Voiture créée avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  create(@Body() voiture: any) {
    return this.voitureService.create(voiture);
  }

  // ===============================
  // lister toutes les voitures
  // ===============================
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des voitures' })
  findAll() {
    return this.voitureService.findAll();
  }

  // ===============================
  // voiture par ID
  // ===============================
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Voiture trouvée' })
  @ApiResponse({ status: 404, description: 'Voiture non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.voitureService.findOne(id);
  }

  // ===============================
  // mettre à jour voiture
  // ===============================
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        marque: { type: 'string', example: 'Toyota' },
        modele: { type: 'string', example: 'Corolla' },
        immatriculation: { type: 'string', example: 'TN-123-456' },
        etat: { type: 'string', example: 'neuf' },
        prix_Jour: { type: 'number', example: 55 },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Voiture mise à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Voiture>) {
    return this.voitureService.update(id, data);
  }

  // ===============================
  // supprimer voiture
  // ===============================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Voiture supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.voitureService.remove(id);
  }

  // ===============================
  // vérifier disponibilité
  // ===============================
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
    return this.voitureService.verifierDisponibilite(
      id,
      new Date(dateDebut),
      new Date(dateFin),
    );
  }
}