import {
  Controller, Get, Post, Patch, Put,
  Body, Param, Query, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';

import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';

import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiBody, ApiParam, ApiQuery, ApiResponse
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Factures')
@Controller('factures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FactureController {

  constructor(private readonly factureService: FactureService) {}

  // ===== CREATE MANUEL =====
  @Post()
  @Roles('hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une facture manuelle' })
  @ApiBody({ type: CreateFactureDto })
  @ApiResponse({ status: 201, description: 'Facture créée et notification envoyée' })
  create(@Body() dto: CreateFactureDto, @Request() req: any) {
    return this.factureService.create(dto);
  }

  // ===== CREATE AUTOMATIQUE =====
  @Post('from')
  @Roles('hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une facture automatiquement depuis réservation ou location' })
  @ApiQuery({ name: 'reservationId', required: false, type: Number, description: 'ID de la réservation' })
  @ApiQuery({ name: 'locationId', required: false, type: Number, description: 'ID de la location' })
  @ApiResponse({ status: 201, description: 'Facture créée automatiquement' })
  createFacture(
    @Query('reservationId') reservationId?: number,
    @Query('locationId') locationId?: number,
  ) {
    return this.factureService.createFacture(reservationId, locationId);
  }

  // ===== PAIEMENT =====
  @Put(':id/payer')
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payer une facture (simulation)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Facture payée avec succès' })
  payer(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.factureService.payer(id, req.user.iduser);
  }

  // ===== UPDATE =====
  @Patch(':id')
  @Roles('hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une facture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateFactureDto })
  @ApiResponse({ status: 200, description: 'Facture mise à jour' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFactureDto,
    @Request() req: any
  ) {
    return this.factureService.update(id, dto);
  }

  // ===== GET ALL =====
  @Get()
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister toutes les factures' })
  @ApiResponse({ status: 200, description: 'Liste des factures' })
  findAll(@Request() req: any) {
    return this.factureService.findAll(req.user.iduser, req.user.role);
  }

  // ===== GET ONE =====
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Afficher une facture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Détails de la facture' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.factureService.findOne(id, req.user.iduser, req.user.role);
  }
}