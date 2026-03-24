import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelManager } from '../entities/hotel-manager.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HotelManagerService {

  constructor(
    @InjectRepository(HotelManager)
    private hotelManagerRepository: Repository<HotelManager>,
  ) {}

  // ================= GET ALL =================
  async findAll(): Promise<HotelManager[]> {
    return await this.hotelManagerRepository.find({
      relations: ['chambres', 'reservations'],
    });
  }

  // ================= GET ONE =================
  async findOne(id: number): Promise<HotelManager | null> {
    return await this.hotelManagerRepository.findOne({
      where: { iduser: id },
      relations: ['chambres', 'reservations'],
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: Partial<HotelManager>) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); // 🔥 hash
    }

    return await this.hotelManagerRepository.update(id, data);
  }

  // ================= DELETE =================
  async remove(id: number) {
    return await this.hotelManagerRepository.delete(id);
  }
}