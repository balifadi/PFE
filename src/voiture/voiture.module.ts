import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Voiture } from '../entities/voiture.entity';
import { Agence } from '../entities/agence.entity';
import { Location } from '../entities/location.entity';

import { VoitureService } from './voiture.service';
import { VoitureController } from './voiture.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Voiture,
      Agence,
      Location
    ]),
  ],
  controllers: [VoitureController],
  providers: [VoitureService],
  exports: [VoitureService],
})
export class VoitureModule {}