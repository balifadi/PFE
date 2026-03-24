import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  // ================= GET ALL =================
  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find({
      relations: ['zones', 'hotels', 'agences', 'notifications', 'avis'],
    });
  }

  // ================= GET ONE =================
  async findOne(id: number): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { iduser: id },
      relations: ['zones', 'hotels', 'agences', 'notifications', 'avis'],
    });
  }

  // ================= UPDATE =================
  async update(id: number, data: Partial<Admin>) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); // 🔥 hash
    }

    return await this.adminRepository.update(id, data);
  }

  // ================= DELETE =================
  async remove(id: number) {
    return await this.adminRepository.delete(id);
  }
}