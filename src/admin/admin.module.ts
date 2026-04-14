import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { Hotel } from '../entities/hotel.entity';
import { Agence } from '../entities/agence.entity';
import { Reservation } from '../entities/reservation.entity';
import { Facture } from '../entities/facture.entity';
import { Zone } from '../entities/zone.entity';
import { Notification } from '../entities/notification.entity';
import { Avis } from '../entities/avis.entity';
import { Location } from '../entities/location.entity';
import { Voiture } from '../entities/voiture.entity';
import { Chambre } from '../entities/chambre.entity';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Client,
      Hotel,
      Agence,
      Reservation,
      Facture,
      Zone,
      Notification,
      Avis,
      Location,
      Voiture,
      Chambre,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}