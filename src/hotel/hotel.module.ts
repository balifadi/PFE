import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hotel } from '../entities/hotel.entity';
import { Admin } from '../entities/admin.entity';
import { Chambre } from '../entities/chambre.entity';
import { HotelManager } from '../entities/hotel-manager.entity';

import { NotificationModule } from '../notification/notification.module';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Client } from '../entities/client.entity';
import { Notification } from '../entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hotel,
      Admin,
      Client,
      Notification
    ]),
    NotificationModule,
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}