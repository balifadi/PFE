import {
  Controller, Get, Post, Body, Param,
  Delete, Put, Query, ParseIntPipe,
  UseGuards, Request
} from '@nestjs/common';

import { ChambreService } from './chambre.service';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Chambres')
@Controller('chambres')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChambreController {

  constructor(private readonly chambreService: ChambreService) {}

  // ===== CREATE =====
  @Post()
  @Roles('admin', 'hotel-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une chambre' })
  @ApiBody({ type: CreateChambreDto })
  create(@Body() dto: CreateChambreDto, @Request() req: any) {
    return this.chambreService.create(dto, req.user);
  }

  // ===== FIND ALL =====
  @Get()
  @Roles('admin', 'hotel-manager', 'client', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister toutes les chambres' })
  findAll(@Request() req: any) {
    return this.chambreService.findAll(req.user.iduser, req.user.role);
  }

  // ===== FIND ONE =====
  @Get(':id')
  @Roles('admin', 'hotel-manager', 'client', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Afficher une chambre' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.chambreService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== UPDATE =====
  @Put(':id')
  @Roles('admin', 'hotel-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une chambre' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateChambreDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChambreDto,
    @Request() req: any
  ) {
    return this.chambreService.update(id, req.user, dto);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une chambre' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.chambreService.remove(id, req.user);
  }

  // ===== DISPONIBILITÉ =====
  @Get(':id/disponibilite')
  @Roles('admin', 'hotel-manager', 'client', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier disponibilité chambre' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiQuery({ name: 'dateDebut', type: String, example: '2026-04-01' })
  @ApiQuery({ name: 'dateFin', type: String, example: '2026-04-05' })
  verifierDisponibilite(
    @Param('id', ParseIntPipe) id: number,
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.chambreService.verifierDisponibilite(
      id,
      new Date(dateDebut),
      new Date(dateFin)
    );
  }
}