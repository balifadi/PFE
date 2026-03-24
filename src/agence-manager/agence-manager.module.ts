import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgenceManager } from '../entities/agence-manager.entity';
import { Location } from '../entities/location.entity';
import { Voiture } from '../entities/voiture.entity';

import { AgenceManagerService } from './agence-manager.service';
import { AgenceManagerController } from './agence-manager.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgenceManager,
      Location,
      Voiture,
    ]),
  ],
  controllers: [AgenceManagerController],
  providers: [AgenceManagerService],
  exports: [AgenceManagerService],
})
export class AgenceManagerModule {}
