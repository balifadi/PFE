import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Facture } from '../entities/facture.entity';
import { Client } from '../entities/client.entity';
import { Reservation } from '../entities/reservation.entity';
import { Location } from '../entities/location.entity';

@Module({
imports: [
TypeOrmModule.forFeature([
Facture,
Client,
Reservation,
Location, // كل الكيانات اللي Facture عندها علاقات معاهم
]),
],
controllers: [FactureController],
providers: [FactureService],
exports: [FactureService], // باش يمكن استعمال FactureService في modules أخرى إذا لزم
})
export class FactureModule {}
