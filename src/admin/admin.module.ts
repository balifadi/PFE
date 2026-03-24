import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../entities/admin.entity';
import { Hotel } from '../entities/hotel.entity';
import { Agence } from '../entities/agence.entity';
import { Zone } from '../entities/zone.entity';
import { Notification } from '../entities/notification.entity';
import { Avis } from '../entities/avis.entity';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Hotel,
      Agence,
      Zone,
      Notification,
      Avis, // toutes les entités qui ont une relation avec Admin
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService], // pour réutiliser dans d’autres modules
})
export class AdminModule {}
