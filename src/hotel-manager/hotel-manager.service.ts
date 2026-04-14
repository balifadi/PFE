import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelManager } from '../entities/hotel-manager.entity';

@Injectable()
export class HotelManagerService {

  constructor(
    @InjectRepository(HotelManager)
    private hotelManagerRepository: Repository<HotelManager>,
  ) {}

  async findAll(currentUser: any): Promise<HotelManager[]> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }

    return this.hotelManagerRepository.find({
      relations: ['chambres', 'reservations'],
    });
  }

  async findOne(id: number, currentUser: any): Promise<HotelManager | null> {

    if (currentUser.role === 'hotel-manager' && currentUser.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    if (!['admin', 'hotel-manager'].includes(currentUser.role)) {
      throw new ForbiddenException('Access denied');
    }

    return this.hotelManagerRepository.findOne({
      where: { iduser: id },
      relations: ['chambres', 'reservations'],
    });
  }
}