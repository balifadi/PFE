import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Zone } from '../entities/zone.entity';

import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';

import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../entities/notification.entity';
import { Client } from '../entities/client.entity';
import { Admin } from '../entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Zone,
      Notification,
      Admin,
      Client,
    ]),
    NotificationModule,
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}