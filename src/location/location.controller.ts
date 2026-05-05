import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request
} from '@nestjs/common';

import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LocationController {

  constructor(private readonly locationService: LocationService) {}

  // ===== CREATE =====
 // ===== CREATE =====
  @Post()
 @Roles('client')
 create(@Body() dto: CreateLocationDto, @Request() req: any) {
   return this.locationService.create(dto, req.user.iduser);
 }

  // ===== CONFIRMER =====
  @Patch('confirmer/:id/:clientId')
  @Roles('agence-manager')
  @ApiOperation({ summary: 'Confirmer une location par l’agence' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiParam({ name: 'clientId', example: 5 })
  confirmer(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.locationService.confirmerLocation(id, clientId);
  }

  // ===== ANNULER =====
  @Patch('annuler/:id/:clientId')
  @Roles('agence-manager', 'client')
  @ApiOperation({ summary: 'Annuler une location' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiParam({ name: 'clientId', example: 5 })
  annuler(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.locationService.annulerLocation(id, clientId);
  }

  // ===== UPDATE =====
  @Patch(':id')
  @Roles('agence-manager')
  @ApiOperation({ summary: 'Mettre à jour les dates ou statut de la location' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateLocationDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
    @Request() req: any
  ) {
    return this.locationService.updateDates(
      id,
      req.user.iduser,
      req.user.role,
      dto
    );
  }

  // ===== FIND ALL =====
  @Get()
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Lister toutes les locations selon le rôle' })
  findAll(@Request() req: any) {
    return this.locationService.findAll(req.user.iduser, req.user.role);
  }

  // ===== FIND ONE =====
  @Get(':id')
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Afficher une location par ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.locationService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin', 'agence-manager')
  @ApiOperation({ summary: 'Supprimer une location' })
  @ApiParam({ name: 'id', example: 1 })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.locationService.remove(id, req.user.iduser, req.user.role);
  }
}