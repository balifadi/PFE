import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Zone } from '../entities/zone.entity';
import { Admin } from '../entities/admin.entity';

import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';

import { NotificationModule } from '../notification/notification.module'; // 🔥 مهم

@Module({
imports: [
TypeOrmModule.forFeature([
Zone,
Admin, // ✅ خاطر InjectRepository(Admin)
]),
NotificationModule, // ✅ خاطر تستعمل NotificationService
],
controllers: [ZoneController],
providers: [ZoneService],
exports: [ZoneService],
})
export class ZoneModule {}
