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

import { AgenceService } from './agence.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Agences')
@Controller('agences')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgenceController {

  constructor(private readonly agenceService: AgenceService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer une agence' })
  @ApiBody({ type: CreateAgenceDto })
  @ApiResponse({ status: 201, description: 'Agence créée avec succès' })
  create(@Body() dto: CreateAgenceDto, @Request() req: any) {
    return this.agenceService.create(dto, req.user.iduser);
  }

  @Get()
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Lister toutes les agences' })
  findAll(@Request() req: any) {
    return this.agenceService.findAll(req.user.iduser, req.user.role);
  }


@Get('localisation-public')
  @ApiOperation({ summary: 'Localisation des agences (public)' })
  getLocationsPublic() {
    return this.agenceService.getLocalisationPublic();
  }


  @Get(':id')
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Obtenir une agence par ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.agenceService.findOneByUser(id, req.user.iduser, req.user.role);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier une agence' })
  @ApiBody({ type: UpdateAgenceDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgenceDto) {
    return this.agenceService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une agence' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agenceService.remove(id);
  }



}