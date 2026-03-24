import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HotelManager } from '../entities/hotel-manager.entity';
import { Reservation } from '../entities/reservation.entity';
import { Chambre } from '../entities/chambre.entity';

import { HotelManagerService } from './hotel-manager.service';
import { HotelManagerController } from './hotel-manager.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HotelManager,
      Reservation,
      Chambre,
    ]),
  ],
  controllers: [HotelManagerController],
  providers: [HotelManagerService],
  exports: [HotelManagerService],
})
export class HotelManagerModule {}