import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avis } from '../entities/avis.entity';
import { Client } from '../entities/client.entity';
import { Admin } from '../entities/admin.entity';
import { AvisService } from './avis.service';
import { AvisController } from './avis.controller';

@Module({
imports: [TypeOrmModule.forFeature([Avis, Client, Admin])],
controllers: [AvisController],
providers: [AvisService],
exports: [AvisService],
})
export class AvisModule {}
