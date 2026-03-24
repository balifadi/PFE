import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenceManager } from '../entities/agence-manager.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgenceManagerService {

  constructor(
    @InjectRepository(AgenceManager)
    private agenceManagerRepository: Repository<AgenceManager>,
  ) {}

  // ================= GET ALL =================
  async findAll(): Promise<AgenceManager[]> {
    return await this.agenceManagerRepository.find({
      relations: ['voitures', 'locations'],
    });
  }

  // ================= GET ONE =================
  async findOne(id: number): Promise<AgenceManager | null> {
    return await this.agenceManagerRepository.findOne({
      where: { iduser: id },
      relations: ['voitures', 'locations'],
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: Partial<AgenceManager>) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); // 🔥 hash
    }

    return await this.agenceManagerRepository.update(id, data);
  }

  // ================= DELETE =================
  async remove(id: number) {
    return await this.agenceManagerRepository.delete(id);
  }
}