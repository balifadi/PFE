import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { FactureService } from './facture.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Factures')
@Controller('factures')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  // =====================================================
  // 🔵 CREATE MANUEL
  // =====================================================
  @Post()
  @Roles('hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Créer une facture manuelle' })
  @ApiBody({ type: CreateFactureDto })
  @ApiResponse({ status: 201, description: 'Facture créée avec succès' })
  create(@Body() dto: CreateFactureDto) {
    return this.factureService.create(dto);
  }

  // =====================================================
  // 🔵 CREATE AUTO (reservation / location)
  // =====================================================
  @Post('from')
  @Roles('hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Créer une facture automatiquement' })
  @ApiQuery({ name: 'reservationId', required: false })
  @ApiQuery({ name: 'locationId', required: false })
  @ApiResponse({ status: 201, description: 'Facture générée automatiquement' })
  createAuto(
    @Query('reservationId') reservationId?: number,
    @Query('locationId') locationId?: number,
  ) {
    return this.factureService.createFacture(reservationId, locationId);
  }

  // =====================================================
  // 🔵 PAYMENT
  // =====================================================
  @Put(':id/payer')
  @Roles('client')
  @ApiOperation({ summary: 'Payer une facture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Paiement effectué' })
  payer(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.factureService.payer(id, req.user.iduser);
  }

  // =====================================================
  // 🔵 UPDATE
  // =====================================================
  @Patch(':id')
  @Roles('hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Modifier une facture' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateFactureDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFactureDto,
  ) {
    return this.factureService.update(id, dto);
  }

  // =====================================================
  // 🔵 GET ALL
  // =====================================================
  @Get()
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Lister toutes les factures' })
  findAll(@Request() req: any) {
    return this.factureService.findAll(req.user.iduser, req.user.role);
  }

  // =====================================================
  // 🔵 DELETE (Admin only)
  // =====================================================
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une facture (Admin uniquement)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Facture supprimée avec succès' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.factureService.remove(id);
  }

  // =====================================================
  // 🔵 GET ONE
  // =====================================================
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Afficher une facture' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.factureService.findOne(id, req.user.iduser, req.user.role);
  }
}