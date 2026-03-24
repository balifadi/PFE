import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from '../entities/reservation.entity';
import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // créer réservation
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        date_debut: { type: 'string', format: 'date', example: '2026-03-20' },
        date_fin: { type: 'string', format: 'date', example: '2026-03-25' },
        statut: { type: 'string', example: 'en attente' },
        clientId: { type: 'number', example: 1 },
        hotelManagerId: { type: 'number', example: 1 },
        chambresIds: { type: 'array', items: { type: 'number' }, example: [1, 2] },
      },
      required: ['date_debut', 'date_fin', 'clientId', 'hotelManagerId', 'chambresIds']
    }
  })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès' })
  create(@Body() reservation: any) {
    return this.reservationService.create(reservation);
  }

  // confirmer réservation
  @Patch('confirmer/:id/:clientId')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation confirmée' })
  confirmer(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.reservationService.confirmerReservation(id, clientId);
  }

  // annuler réservation
  @Patch('annuler/:id/:clientId')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  annuler(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.reservationService.annulerReservation(id, clientId);
  }

  // afficher toutes les réservations
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  // afficher réservation par id
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation trouvée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  // supprimer réservation
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Réservation supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}