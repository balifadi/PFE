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
  Request
} from '@nestjs/common';

import { AvisService } from './avis.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {

  constructor(private readonly avisService: AvisService) {}

  // ===== CREATE =====
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un avis' })
  @ApiBody({ type: CreateAvisDto })
  create(@Body() dto: CreateAvisDto, @Request() req: any) {
    return this.avisService.create(dto, req.user.iduser);
  }

  // ===== PUBLIC =====
  @Get('public')
  @ApiOperation({ summary: 'Lister tous les avis (public)' })
  findAllPublic() {
    return this.avisService.findAllPublic();
  }

  // ===== GET ONE =====
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Afficher un avis' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.avisService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== UPDATE =====
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un avis' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateAvisDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAvisDto,
    @Request() req: any
  ) {
    return this.avisService.update(id, req.user.iduser, dto);
  }

  // ===== DELETE =====
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.avisService.remove(id, req.user.iduser, req.user.role);
  }


  // ===== PUBLIC FILTER =====
  @Get('public/type/:type')
  @ApiOperation({ summary: 'Filtrer par type (public)' })
  consulterParTypePublic(@Param('type') type: string) {
    return this.avisService.consulterParType(type);
  }

  // ===== BY TARGET =====
  @Get('target/:type/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Avis par cible' })
  getByTarget(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.avisService.getAvisByTarget(type, id);
  }


  // ===== PUBLIC AVERAGE =====
  @Get('public/average/:type/:id')
  @ApiOperation({ summary: 'Note moyenne (public)' })
  getAveragePublic(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.avisService.getAverageRating(type, id);
  }
}