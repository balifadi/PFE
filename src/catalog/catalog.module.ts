import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from '../entities/hotel.entity';
import { Agence } from '../entities/agence.entity';
import { Zone } from '../entities/zone.entity';

import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Agence, Zone])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
