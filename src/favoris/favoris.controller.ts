import {
  Controller, Post, Get, Delete,
  Body, Request, UseGuards
} from '@nestjs/common';

import { FavorisService } from './favoris.service';
import { CreateFavorisDto } from './dto/create-favoris.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Favoris')
@Controller('favoris')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FavorisController {

  constructor(private readonly favorisService: FavorisService) {}

  @Post()
  @Roles('client')
  @ApiOperation({ summary: 'Ajouter un favori' })
  @ApiBody({ type: CreateFavorisDto })
  @ApiResponse({ status: 201, description: 'Favori ajouté avec succès' })
  addFavori(@Body() body: CreateFavorisDto, @Request() req: any) {
    return this.favorisService.add(req.user.iduser, body.type, body.targetId);
  }

  @Get()
  @Roles('client')
  @ApiOperation({ summary: 'Lister les favoris du client' })
  @ApiResponse({ status: 200, description: 'Liste des favoris' })
  getFavoris(@Request() req: any) {
    return this.favorisService.findAll(req.user.iduser);
  }

  @Delete()
  @Roles('client')
  @ApiOperation({ summary: 'Supprimer un favori' })
  @ApiBody({ type: CreateFavorisDto })
  @ApiResponse({ status: 200, description: 'Favori supprimé avec succès' })
  removeFavori(@Body() body: CreateFavorisDto, @Request() req: any) {
    return this.favorisService.remove(req.user.iduser, body.type, body.targetId);
  }
}