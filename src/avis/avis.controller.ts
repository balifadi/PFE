import {
  Controller, Get, Post, Body, Param,
  Delete, Put, ParseIntPipe
} from '@nestjs/common';

import { AvisService } from './avis.service';
import { Avis } from '../entities/avis.entity';

import {
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {

  constructor(private readonly avisService: AvisService) {}

  // ===============================
  // créer avis (client)
  // ===============================
  @Post(':clientId')

  @ApiParam({
    name: 'clientId',
    type: Number,
    example: 1
  })

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'hotel' },
        note: { type: 'number', example: 4 },
        commentaire: { type: 'string', example: 'Très bon service' }
      },
      required: ['type', 'note']
    }
  })

  @ApiResponse({ status: 201, description: 'Avis créé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de création' })

  create(
    @Body() avis: Partial<Avis>,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    // 🔥 نربط client
    avis.client = { iduser: clientId } as any;

    return this.avisService.create(avis);
  }

  // ===============================
  // afficher tous les avis
  // ===============================
  @Get()

  @ApiResponse({ status: 200, description: 'Liste des avis' })

  findAll() {
    return this.avisService.findAll();
  }

  // ===============================
  // afficher avis par id
  // ===============================
  @Get(':id')

  @ApiParam({
    name: 'id',
    type: Number,
    example: 1
  })

  @ApiResponse({ status: 200, description: 'Avis trouvé' })
  @ApiResponse({ status: 404, description: 'Avis non trouvé' })

  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avisService.findOne(id);
  }

  // ===============================
  // modifier avis (client ou admin)
  // ===============================
  @Put(':id/:clientId')

  @ApiParam({
    name: 'id',
    type: Number,
    example: 1
  })

  @ApiParam({
    name: 'clientId',
    type: Number,
    example: 1
  })

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', example: 'hotel' },
        note: { type: 'number', example: 5 },
        commentaire: { type: 'string', example: 'Service ممتاز' }
      }
    }
  })

  @ApiResponse({ status: 200, description: 'Avis mis à jour' })

  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() data: Partial<Avis>
  ) {
    // نأكد الربط بالclient
    data.client = { iduser: clientId } as any;

    return this.avisService.update(id, data);
  }

  // ===============================
  // supprimer avis
  // ===============================
  @Delete(':id')

  @ApiParam({
    name: 'id',
    type: Number,
    example: 1
  })

  @ApiResponse({ status: 200, description: 'Avis supprimé' })

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.avisService.remove(id);
  }

  // ===============================
  // consulter avis par type
  // ===============================
  @Get('type/:type')

  @ApiParam({
    name: 'type',
    type: String,
    example: 'hotel'
  })

  @ApiResponse({ status: 200, description: 'Avis filtrés par type' })

  consulterParType(@Param('type') type: string) {
    return this.avisService.consulterParType(type);
  }
}