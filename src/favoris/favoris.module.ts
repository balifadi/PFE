import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favoris } from '../entities/favoris.entity';
import { FavorisService } from './favoris.service';
import { FavorisController } from './favoris.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favoris])],
  providers: [FavorisService],
  controllers: [FavorisController],
  exports: [FavorisService],
})
export class FavorisModule {}