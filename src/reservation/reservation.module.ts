import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reservation } from '../entities/reservation.entity';
import { Client } from '../entities/client.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { Chambre } from '../entities/chambre.entity';
import { Facture } from '../entities/facture.entity';
import { Hotel } from '../entities/hotel.entity';

import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

import { NotificationModule } from '../notification/notification.module';
import { FactureModule } from '../facture/facture.module'; // ✅ مهم جداً

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Client,
      HotelManager,
      Chambre,
      Facture,
      Hotel,
    ]),

    NotificationModule, // ✅ باش نستعمل NotificationService
    FactureModule,      // 🔥 باش نستعمل FactureService (facture automatique)
  ],

  controllers: [ReservationController],

  providers: [
    ReservationService,
  
  ],

  exports: [
    ReservationService
  ],
})
export class ReservationModule {}