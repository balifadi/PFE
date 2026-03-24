import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel } from '../entities/hotel.entity';
import { ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  // ===============================
  // ajouter hotel
  // ===============================
  @Post(':clientId')
  @ApiParam({ name: 'clientId', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Hotel Djerba Palace' },
        ville: { type: 'string', example: 'Djerba' },
        nb_Etoiles: { type: 'number', example: 5 },
        telephone: { type: 'string', example: '22123456' },
        imagePath: { type: 'string', example: 'hotel.jpg' },
        latitude: { type: 'number', example: 33.8 },
        longitude: { type: 'number', example: 10.8 },
        adminId: { type: 'number', example: 1 }
      },
      required: ['nom', 'ville', 'nb_Etoiles', 'telephone', 'adminId']
    }
  })
  @ApiResponse({ status: 201, description: 'Hotel créé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur' })
  create(@Body() hotel: any, @Param('clientId', ParseIntPipe) clientId: number) {
    return this.hotelService.create(hotel, clientId);
  }

  // ===============================
  // afficher tous les hotels
  // ===============================
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des hôtels' })
  findAll() {
    return this.hotelService.findAll();
  }

  // ===============================
  // afficher hotel par id
  // ===============================
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Hotel trouvé' })
  @ApiResponse({ status: 404, description: 'Hotel non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  // ===============================
  // modifier hotel
  // ===============================
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string', example: 'Hotel Djerba Palace' },
        ville: { type: 'string', example: 'Djerba' },
        nb_Etoiles: { type: 'number', example: 5 },
        telephone: { type: 'string', example: '22123456' },
        imagePath: { type: 'string', example: 'hotel.jpg' },
        latitude: { type: 'number', example: 33.8 },
        longitude: { type: 'number', example: 10.8 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Hotel mis à jour' })
  update(@Param('id', ParseIntPipe) id: number, @Body() hotel: Partial<Hotel>) {
    return this.hotelService.update(id, hotel);
  }

  // ===============================
  // supprimer hotel
  // ===============================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Hotel supprimé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }
}