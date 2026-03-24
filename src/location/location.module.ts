import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from '../entities/location.entity';
import { Client } from '../entities/client.entity';
import { AgenceManager } from '../entities/agence-manager.entity';
import { Voiture } from '../entities/voiture.entity';
import { Facture } from '../entities/facture.entity';
import { NotificationModule } from '../notification/notification.module'; // ✅ import correct

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      Client,
      AgenceManager,
      Voiture,
      Facture,
    ]),
    NotificationModule, // ✅ NotificationService يأتي من هنا
  ],
  controllers: [LocationController],
  providers: [LocationService], // لا داعي لوضع NotificationService هنا
  exports: [LocationService],
})
export class LocationModule {}