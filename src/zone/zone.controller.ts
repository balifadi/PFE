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
  UploadedFile,
  Query,
} from '@nestjs/common';

import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneFilterDto } from './dto/zone-filter.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Zones')
@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ZoneController {

  constructor(private readonly zoneService: ZoneService) {}

  // ================= CREATE =================
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer une zone touristique' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateZoneDto,
    @Request() req: any,
  ) {
    if (file) {
      dto.imagePath = 'http://localhost:3000/uploads/' + file.filename;
    }
    return this.zoneService.create(dto, req.user.iduser);
  }

  // ================= FIND ALL =================
  @Get()
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Lister toutes les zones (simple)' })
  findAll() {
    return this.zoneService.findAll();
  }

  // ================= 🔥 ADVANCED SEARCH =================
  // ⚠️ Déclaré AVANT :id pour éviter le conflit de route
  @Get('advanced')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Search + Filtrage + Pagination + Sorting' })
  findAdvanced(@Query() filter: ZoneFilterDto) {
    return this.zoneService.findAdvanced(filter);
  }

  // ================= LOCALISATION =================
  // ⚠️ Déclaré AVANT :id pour éviter le conflit de route
  @Get('localisation-public')
  @ApiOperation({ summary: 'Localisation publique des zones' })
  getLocalisationPublic() {
    return this.zoneService.getLocalisationPublic();
  }

  // ================= FIND ONE =================
  @Get(':id')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Obtenir une zone par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.findOne(id);
  }

  // ================= UPDATE =================
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier une zone' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateZoneDto,
  ) {
    if (file) {
      dto.imagePath = 'http://localhost:3000/uploads/' + file.filename;
    }
    return this.zoneService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une zone' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.zoneService.remove(id);
  }
}