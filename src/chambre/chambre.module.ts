import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chambre } from '../entities/chambre.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { Hotel } from '../entities/hotel.entity';
import { Reservation } from '../entities/reservation.entity';
import { ChambreService } from './chambre.service';
import { ChambreController } from './chambre.controller';

@Module({
imports: [
TypeOrmModule.forFeature([
Chambre,
HotelManager,
Hotel,
Reservation, // Toutes les entités nécessaires pour les relations
]),
],
controllers: [ChambreController],
providers: [ChambreService],
exports: [ChambreService], // Pour pouvoir utiliser le service dans d'autres modules
})
export class ChambreModule {}
