import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

import {
  ApiTags, ApiResponse, ApiBearerAuth,
  ApiOperation, ApiParam, ApiBody
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Réservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationController {

  constructor(private readonly reservationService: ReservationService) {}

  // ===== CREATE =====
 @Post()
@Roles('client')
create(@Body() dto: CreateReservationDto, @Request() req: any) {
  return this.reservationService.create(dto, req.user.iduser);
}
  // ===== CONFIRMER =====
  @Patch('confirmer/:id/:clientId')
  @Roles('hotel-manager')
  @ApiOperation({ summary: 'Confirmer une réservation' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiParam({ name: 'clientId', example: 1 })
  confirmer(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,   
  ) {
    return this.reservationService.confirmerReservation(id, clientId);
  }

  // ===== ANNULER =====
  @Patch('annuler/:id/:clientId')
  @Roles('hotel-manager', 'client')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiParam({ name: 'clientId', example: 1 })
  annuler(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.reservationService.annulerReservation(id, clientId);
  }

  // ===== UPDATE =====
  @Patch(':id')
  @Roles('hotel-manager')
  @ApiOperation({ summary: 'Modifier les dates ou statut d’une réservation' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateReservationDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
    @Request() req: any
  ) {
    return this.reservationService.updateDates(
      id,
      req.user.iduser,
      req.user.role,
      dto
    );
  }

  // ===== FIND ALL =====
  @Get()
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Lister toutes les réservations selon le rôle' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  findAll(@Request() req: any) {
    return this.reservationService.findAll(req.user.iduser, req.user.role);
  }

  // ===== FIND ONE =====
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Afficher une réservation' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.reservationService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin', 'hotel-manager')
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.reservationService.remove(id, req.user.iduser, req.user.role);
  }
}