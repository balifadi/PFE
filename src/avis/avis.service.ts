import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avis } from '../entities/avis.entity';

@Injectable()
export class AvisService {

  constructor(
    @InjectRepository(Avis)
    private avisRepository: Repository<Avis>,
  ) {}

  // créer avis
  async create(avis: Partial<Avis>): Promise<Avis> {
    const newAvis = this.avisRepository.create(avis);
    return this.avisRepository.save(newAvis);
  }

  // afficher tous les avis
  async findAll(): Promise<Avis[]> {
    return this.avisRepository.find({ relations: ['admin', 'client'], order: { date_Avis: 'DESC' } });
  }

  // afficher avis par id
  async findOne(id: number): Promise<Avis | null> {
    return this.avisRepository.findOne({
      where: { idavis: id },
      relations: ['admin', 'client'],
    });
  }

  // mettre à jour avis
  async update(id: number, data: Partial<Avis>) {
    await this.avisRepository.update(id, data);
    return this.findOne(id);
  }

  // supprimer avis
  async remove(id: number) {
    return this.avisRepository.delete(id);
  }

  // consulter avis par type (zone, hotel, agence)
  async consulterParType(type: string): Promise<Avis[]> {
    return this.avisRepository.find({
      where: { type },
      relations: ['admin', 'client'],
      order: { date_Avis: 'DESC' }
    });
  }
}