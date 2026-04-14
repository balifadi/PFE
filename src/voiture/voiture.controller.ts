import {
  Controller, Get, Post, Body, Param,
  Delete, Put, Query, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';

import { VoitureService } from './voiture.service';
import { CreateVoitureDto } from './dto/create-voiture.dto';
import { UpdateVoitureDto } from './dto/update-voiture.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Voitures')
@Controller('voitures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VoitureController {

  constructor(private readonly voitureService: VoitureService) {}

  // ===== CREATE =====
  @Post()
  @Roles('admin', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une voiture' })
  @ApiBody({ type: CreateVoitureDto })
  @ApiResponse({ status: 201, description: 'Voiture créée avec succès' })
  create(@Body() dto: CreateVoitureDto, @Request() req: any) {
    return this.voitureService.create(dto, req.user);
  }

  // ===== FIND ALL =====
  @Get()
  @Roles('admin', 'agence-manager', 'client', 'hotel-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister toutes les voitures' })
  @ApiResponse({ status: 200, description: 'Liste des voitures' })
  findAll(@Request() req: any) {
    return this.voitureService.findAll(req.user.iduser, req.user.role);
  }

  // ===== FIND ONE =====
  @Get(':id')
  @Roles('admin', 'agence-manager', 'client', 'hotel-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Afficher une voiture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Détails de la voiture' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.voitureService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== UPDATE =====
  @Put(':id')
  @Roles('admin', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une voiture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateVoitureDto })
  @ApiResponse({ status: 200, description: 'Voiture mise à jour' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVoitureDto,
    @Request() req: any
  ) {
    return this.voitureService.update(id, req.user, dto);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une voiture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Voiture supprimée' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.voitureService.remove(id, req.user);
  }

  // ===== DISPONIBILITÉ =====
  @Get(':id/disponibilite')
  @Roles('admin', 'agence-manager', 'client', 'hotel-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier disponibilité voiture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiQuery({ name: 'dateDebut', type: String, example: '2026-04-01' })
  @ApiQuery({ name: 'dateFin', type: String, example: '2026-04-05' })
  @ApiResponse({ status: 200, description: 'Disponibilité de la voiture' })
  verifierDisponibilite(
    @Param('id', ParseIntPipe) id: number,
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.voitureService.verifierDisponibilite(
      id,
      new Date(dateDebut),
      new Date(dateFin)
    );
  }
}