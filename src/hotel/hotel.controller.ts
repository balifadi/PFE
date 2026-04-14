import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';

@ApiTags('Hotels')
@Controller('hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HotelController {

  constructor(private readonly hotelService: HotelService) {}

  // ===== CREATE =====
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un hôtel' })
  @ApiBody({ type: CreateHotelDto })
  @ApiResponse({ status: 201, description: 'Hôtel créé avec succès' })
  create(@Body() dto: CreateHotelDto, @Request() req: any) {
    return this.hotelService.create(dto, req.user.iduser);
  }

  // ===== GET ALL =====
  @Get()
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Lister tous les hôtels' })
  @ApiResponse({ status: 200, description: 'Liste des hôtels' })
  findAll(@Request() req: any) {
    return this.hotelService.findAll(req.user.iduser, req.user.role);
  }


  // ===== LOCALISATION PUBLIC =====
  @Get('localisation-public')
  @ApiOperation({ summary: 'Localisation des hôtels (public)' })
  @ApiResponse({ status: 200, description: 'Coordonnées publiques des hôtels' })
  getLocalisationPublic() {
    return this.hotelService.getLocalisationPublic();
  }


  // ===== GET ONE =====
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Afficher un hôtel' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Détails de l’hôtel' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.hotelService.findOneByUser(id, req.user.iduser, req.user.role);
  }

  // ===== UPDATE =====
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier un hôtel' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateHotelDto })
  @ApiResponse({ status: 200, description: 'Hôtel mis à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHotelDto) {
    return this.hotelService.update(id, dto);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un hôtel' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Hôtel supprimé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }

  
}