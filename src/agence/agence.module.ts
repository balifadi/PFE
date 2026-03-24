import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agence } from '../entities/agence.entity';
import { Admin } from '../entities/admin.entity';
import { Voiture } from '../entities/voiture.entity';
import { NotificationModule } from '../notification/notification.module'; // pour NotificationService
import { AgenceService } from './agence.service';
import { AgenceController } from './agence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agence,
      Admin,
      Voiture, // 🔹 nécessaire pour charger relations: ['voitures']
    ]),
    NotificationModule, // 🔹 pour NotificationService
  ],
  controllers: [AgenceController],
  providers: [AgenceService],
  exports: [AgenceService], // pour réutiliser le service ailleurs
})
export class AgenceModule {}