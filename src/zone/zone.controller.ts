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
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';

import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiConsumes
} from '@nestjs/swagger';

// ✅ NEW
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Zones')
@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ZoneController {

  constructor(private readonly zoneService: ZoneService) {}

  // ===== CREATE =====
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer une zone touristique' })
  @ApiConsumes('multipart/form-data') // ✅ NEW
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        }
      })
    })
  )
  @ApiBody({ type: CreateZoneDto })
  @ApiResponse({ status: 201, description: 'Zone créée avec succès' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateZoneDto,
    @Request() req: any
  ) {

    // ✅ ajout image
    if (file) {
      dto.imagePath = `http://localhost:3000/uploads/${file.filename}`;
    }

    return this.zoneService.create(dto, req.user.iduser);
  }

  // ===== GET ALL =====
  @Get()
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Lister toutes les zones' })
  @ApiResponse({ status: 200, description: 'Liste des zones' })
  findAll() {
    return this.zoneService.findAll();
  }

  // ===== LOCALISATION PUBLIC =====
  @Get('localisation-public')
  @ApiOperation({ summary: 'Localisation des zones (public)' })
  @ApiResponse({ status: 200, description: 'Coordonnées publiques des zones' })
  getLocalisationPublic() {
    return this.zoneService.getLocalisationPublic();
  }

  // ===== GET ONE =====
  @Get(':id')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Afficher une zone' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Détails de la zone' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.findOne(id);
  }

  // ===== UPDATE =====
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier une zone' })
  @ApiConsumes('multipart/form-data') // ✅ NEW
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        }
      })
    })
  )
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateZoneDto })
  @ApiResponse({ status: 200, description: 'Zone mise à jour' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateZoneDto
  ) {

    // ✅ ajout image si existe
    if (file) {
      dto.imagePath = `http://localhost:3000/uploads/${file.filename}`;
    }

    return this.zoneService.update(id, dto);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une zone' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Zone supprimée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.remove(id);
  }
}