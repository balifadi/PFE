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
} from '@nestjs/common';

import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelFilterDto } from './dto/hotel-filter.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Hotels')
@Controller('hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HotelController {

  constructor(private readonly hotelService: HotelService) {}

  // ================= CREATE =================
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un hôtel' })
  create(@Body() dto: CreateHotelDto, @Request() req: any) {
    return this.hotelService.create(dto, req.user.iduser);
  }

  // ================= FIND ALL =================
  @Get()
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Lister tous les hôtels (simple)' })
  findAll(@Request() req: any) {
    return this.hotelService.findAll(req.user.iduser, req.user.role);
  }

  // ================= 🔥 ADVANCED SEARCH =================
  // ⚠️ Déclaré AVANT :id pour éviter le conflit de route
  @Get('advanced')
  @Roles('admin', 'client', 'hotel-manager')
  @ApiOperation({ summary: 'Search + Filtrage + Pagination + Sorting' })
  findAdvanced(@Query() filter: HotelFilterDto) {
    return this.hotelService.findAdvanced(filter);
  }

  // ================= LOCALISATION =================
  // ⚠️ Déclaré AVANT :id pour éviter le conflit de route
  @Get('localisation-public')
  @ApiOperation({ summary: 'Localisation publique des hôtels' })
  getLocalisationPublic() {
    return this.hotelService.getLocalisationPublic();
  }

  // ================= FIND ONE =================
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager')
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.hotelService.findOneByUser(
      id,
      req.user.iduser,
      req.user.role,
    );
  }

  // ================= UPDATE =================
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Modifier un hôtel' })
  @ApiBody({ type: UpdateHotelDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHotelDto,
  ) {
    return this.hotelService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un hôtel' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }
}