import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from '../entities/notification.entity';
import { Client } from '../entities/client.entity';
import { Admin } from '../entities/admin.entity';

@Module({
imports: [
TypeOrmModule.forFeature([
Notification,
Client,
Admin, // كل الكيانات اللي Notification عندها علاقات معاهم
]),
],
controllers: [NotificationController],
providers: [NotificationService],
exports: [NotificationService], // باش يمكن استعمال NotificationService في modules أخرى
})
export class NotificationModule {}