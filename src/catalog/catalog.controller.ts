import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { CatalogService } from './catalog.service';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('landing')
  @ApiOperation({ summary: 'Public landing data for the home page' })
  getLanding() {
    return this.catalogService.getLanding();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search public catalog data' })
  search(
    @Query('service') service?: string,
    @Query('destination') destination?: string,
    @Query('term') term?: string,
  ) {
    return this.catalogService.searchLanding(service ?? 'all', destination ?? '', term ?? destination ?? '');
  }

  @Get('hotels/:id')
  @ApiOperation({ summary: 'Public hotel details' })
  @ApiParam({ name: 'id', example: 1 })
  getHotel(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getHotel(id);
  }

  @Get('agences/:id')
  @ApiOperation({ summary: 'Public agency details' })
  @ApiParam({ name: 'id', example: 1 })
  getAgence(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getAgence(id);
  }

  @Get('zones/:id')
  @ApiOperation({ summary: 'Public zone details' })
  @ApiParam({ name: 'id', example: 1 })
  getZone(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getZone(id);
  }
}
