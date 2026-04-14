import {
  Controller, Get, Param,
  ParseIntPipe, UseGuards, Request
} from '@nestjs/common';
import { HotelManagerService } from './hotel-manager.service';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('HotelManagers')
@Controller('hotel-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HotelManagerController {

  constructor(private readonly hotelManagerService: HotelManagerService) {}

  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Get all hotel managers' })
  findAll(@Request() req: any) {
    return this.hotelManagerService.findAll(req.user);
  }

  @Get(':id')
  @Roles('admin', 'hotel-manager')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Get hotel manager by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.hotelManagerService.findOne(id, req.user);
  }
}