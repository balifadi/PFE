import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { Client } from '../entities/client.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { Chambre } from '../entities/chambre.entity';
import { Facture } from '../entities/facture.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { NotificationModule } from '../notification/notification.module'; // ✅ import correct

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Client,
      HotelManager,
      Chambre,
      Facture,
    ]),
    NotificationModule, // ✅ NotificationService يأتي من هنا
  ],
  controllers: [ReservationController],
  providers: [ReservationService], // لا داعي لوضع NotificationService هنا
  exports: [ReservationService],
})
export class ReservationModule {}