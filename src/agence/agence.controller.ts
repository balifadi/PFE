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
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { AgenceService } from './agence.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { AgenceFilterDto } from './dto/agence-filter.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Agences')
@Controller('agences')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgenceController {
  constructor(private readonly agenceService: AgenceService) {}

  // ================= UPLOAD IMAGES =================
  @Post('upload-images')
  @Roles('admin')
  @ApiOperation({ summary: 'Téléverser des images d’agence' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      images: (files || []).map((file) => `http://localhost:3000/uploads/${file.filename}`),
    };
  }

  // ================= CREATE =================
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer une agence' })
  @ApiBody({ type: CreateAgenceDto })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateAgenceDto, @Request() req: any) {
    return this.agenceService.create(dto, req.user.iduser);
  }

  // ================= FIND ALL =================
  @Get()
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Lister toutes les agences' })
  findAll(@Request() req: any) {
    return this.agenceService.findAll(req.user.iduser, req.user.role);
  }

  // ================= 🔥 ADVANCED =================
  // ⚠️ Must be declared BEFORE :id route to avoid route conflict
  @Get('advanced')
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Search + Filtrage + Pagination + Sorting' })
  findAdvanced(@Query() filter: AgenceFilterDto) {
    return this.agenceService.findAdvanced(filter);
  }

  // ================= LOCALISATION =================
  // ⚠️ Must be declared BEFORE :id route to avoid route conflict
  @Get('localisation-public')
  @ApiOperation({ summary: 'Localisation des agences (public)' })
  getLocationsPublic() {
    return this.agenceService.getLocalisationPublic();
  }

  // ================= FIND ONE =================
  @Get(':id')
  @Roles('admin', 'client', 'agence-manager')
  @ApiOperation({ summary: 'Obtenir une agence par ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.agenceService.findOneByUser(
      id,
      req.user.iduser,
      req.user.role,
    );
  }

  // ================= UPDATE =================
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier une agence' })
  @ApiBody({ type: UpdateAgenceDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgenceDto,
  ) {
    return this.agenceService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une agence' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agenceService.remove(id);
  }
}
