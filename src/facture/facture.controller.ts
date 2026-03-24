import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { FactureService } from './facture.service';
import { ApiTags, ApiParam, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Factures')
@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientId: { type: 'number', example: 1 },
        reservationId: { type: 'number', example: 1 },
        locationId: { type: 'number', example: 1 },
        mode_Paiement: { type: 'string', example: 'Carte bancaire' },
        montant_Total: { type: 'number', example: 500 },
        date_Facture: { type: 'string', format: 'date', example: '2026-03-22' },
        statut: { type: 'string', example: 'non payée' },
      },
       required: ['clientId', 'mode_Paiement', 'montant_Total', 'date_Facture'],
    }
  })
  @ApiResponse({ status: 201, description: 'Facture créée' })
  create(@Body() facture: any) {
    return this.factureService.create(facture);
  }

  // création avec query params optionnelles
  @Post('from')
  @ApiQuery({ name: 'reservationId', type: Number, required: false })
  @ApiQuery({ name: 'locationId', type: Number, required: false })
  @ApiResponse({ status: 201, description: 'Facture générée depuis réservation ou location' })
  createFacture(
    @Query('reservationId', ParseIntPipe) reservationId?: number,
    @Query('locationId', ParseIntPipe) locationId?: number,
  ) {
    return this.factureService.createFacture(reservationId, locationId);
  }

  @Patch(':id/statut')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ schema: { type: 'object', properties: { statut: { type: 'string', example: 'payée' } }, required: ['statut'] } })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  updateStatut(@Param('id', ParseIntPipe) id: number, @Body('statut') statut: string) {
    return this.factureService.updateStatut(id, statut);
  }

  @Get(':id/montant-total')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Montant total calculé' })
  calculerMontantTotal(@Param('id', ParseIntPipe) id: number) {
    return this.factureService.calculerMontantTotal(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Liste des factures' })
  findAll() {
    return this.factureService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Facture trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.factureService.findOne(id);
  }
}