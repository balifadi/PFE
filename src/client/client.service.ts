import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  // ================= GET ALL =================
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: [
        'reservations',
        'locations',
        'facture',
        'notifications',
        'avis',
      ],
    });
  }

  // ================= GET ONE =================
  async findOne(id: number): Promise<Client | null> {
    return await this.clientRepository.findOne({
      where: { iduser: id },
      relations: [
        'reservations',
        'locations',
        'facture',
        'notifications',
        'avis',
      ],
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: Partial<Client>) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); // 🔥 hash
    }

    return await this.clientRepository.update(id, data);
  }

  // ================= DELETE =================
  async remove(id: number) {
    return await this.clientRepository.delete(id);
  }
}