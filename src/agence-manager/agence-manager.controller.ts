import {
  Controller, Get, Param,
  ParseIntPipe, UseGuards, Request
} from '@nestjs/common';
import { AgenceManagerService } from './agence-manager.service';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('AgenceManagers')
@Controller('agence-managers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgenceManagerController {

  constructor(private readonly agenceManagerService: AgenceManagerService) {}

  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Get all agence managers' })
  findAll(@Request() req: any) {
    return this.agenceManagerService.findAll(req.user);
  }

  @Get(':id')
  @Roles('admin', 'agence-manager')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Get agence manager by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ) {
    return this.agenceManagerService.findOne(id, req.user);
  }
}