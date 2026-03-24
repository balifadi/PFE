import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from '../entities/hotel.entity';
import { Admin } from '../entities/admin.entity';
import { Chambre } from '../entities/chambre.entity';
import { NotificationModule } from '../notification/notification.module'; // pour NotificationService
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hotel,
      Admin,
      Chambre, // 🔹 nécessaire pour charger relations: ['chambres']
    ]),
    NotificationModule, // 🔹 pour NotificationService
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService], // pour réutiliser le service ailleurs
})
export class HotelModule {}