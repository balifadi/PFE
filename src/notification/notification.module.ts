import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from '../entities/notification.entity';
import { Client } from '../entities/client.entity';
import { Admin } from '../entities/admin.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { AgenceManager } from '../entities/agence-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Client,
      Admin,
      HotelManager,
      AgenceManager, // كل الكيانات اللي Notification عندها علاقات معاهم
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService], // باش يمكن استعمال NotificationService في modules أخرى
})
export class NotificationModule {}