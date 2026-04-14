import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Facture } from '../entities/facture.entity';
import { Client } from '../entities/client.entity';
import { Reservation } from '../entities/reservation.entity';
import { Location } from '../entities/location.entity';

import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facture, Client, Reservation, Location]),
    NotificationModule, // 👈 هنا الحل
  ],
  controllers: [FactureController],
  providers: [FactureService],
  exports: [FactureService],
})
export class FactureModule {}