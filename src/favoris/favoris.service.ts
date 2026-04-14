import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavorisType, Favoris } from '../entities/favoris.entity';

@Injectable()
export class FavorisService {
  constructor(
    @InjectRepository(Favoris)
    private repo: Repository<Favoris>,
  ) {}

  // ================= ADD FAVORI =================
  async add(clientId: number, type: FavorisType, targetId: number) {
    const existing = await this.repo.findOne({
      where: { client: { iduser: clientId }, type, targetId },
    });
    if (existing) return existing;

    return this.repo.save({
      client: { iduser: clientId },
      type,
      targetId,
    });
  }

  // ================= LIST FAVORIS =================
  async findAll(clientId: number) {
    return this.repo.find({
      where: { client: { iduser: clientId } },
    });
  }

  // ================= REMOVE FAVORI =================
  async remove(clientId: number, type: FavorisType, targetId: number) {
    const favoris = await this.repo.findOne({
      where: { client: { iduser: clientId }, type, targetId },
    });
    if (!favoris) return null;

    return this.repo.remove(favoris);
  }
}