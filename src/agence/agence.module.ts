import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Agence } from '../entities/agence.entity';
import { Admin } from '../entities/admin.entity';
import { Voiture } from '../entities/voiture.entity';
import { AgenceManager } from '../entities/agence-manager.entity';

import { NotificationModule } from '../notification/notification.module';
import { VoitureModule } from '../voiture/voiture.module';
import { AgenceService } from './agence.service';
import { AgenceController } from './agence.controller';
import { Client } from '../entities/client.entity';
import { Notification } from '../entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agence,
      Admin,
      Client,
      Notification
    ]),
    NotificationModule,
    VoitureModule,
  ],
  controllers: [AgenceController],
  providers: [AgenceService],
  exports: [AgenceService],
})
export class AgenceModule {}