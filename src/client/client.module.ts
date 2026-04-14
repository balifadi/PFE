import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Client } from '../entities/client.entity';
import { Reservation } from '../entities/reservation.entity';
import { Location } from '../entities/location.entity';
import { Facture } from '../entities/facture.entity';
import { Notification } from '../entities/notification.entity';
import { Avis } from '../entities/avis.entity';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Reservation,
      Location,
      Facture,
      Notification,
      Avis,
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}