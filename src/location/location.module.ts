import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from '../entities/location.entity';
import { Client } from '../entities/client.entity';
import { AgenceManager } from '../entities/agence-manager.entity';
import { Voiture } from '../entities/voiture.entity';
import { Facture } from '../entities/facture.entity';
import { FactureModule } from '../facture/facture.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Client, AgenceManager, Voiture,Facture]),
    NotificationModule,
    FactureModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}