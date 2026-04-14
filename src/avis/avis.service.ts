import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Avis } from '../entities/avis.entity';
import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';

@Injectable()
export class AvisService {

  constructor(
    @InjectRepository(Avis)
    private avisRepository: Repository<Avis>,
  ) {}

  // ===== CREATE =====
  async create(dto: CreateAvisDto, clientId: number): Promise<Avis> {

    if (!['hotel', 'zone', 'agence'].includes(dto.type)) {
      throw new NotFoundException('Type invalide');
    }

    const avis = this.avisRepository.create({
      type: dto.type,
      note: dto.note,
      commentaire: dto.commentaire,
      targetId: dto.targetId,
      client: { iduser: clientId } as any,
      date_Avis: new Date(),
    });

    return this.avisRepository.save(avis);
  }

  // ===== PUBLIC FIND ALL =====
  async findAllPublic(): Promise<Avis[]> {
    return this.avisRepository.find({
      relations: ['client'],
      order: { date_Avis: 'DESC' },
    });
  }

  // ===== FIND ONE =====
  async findOne(id: number, userId: number, role: string): Promise<Avis> {

    const avis = await this.avisRepository.findOne({
      where: { idavis: id },
      relations: ['client', 'admin'],
    });

    if (!avis) throw new NotFoundException('Avis non trouvé');

    return avis;
  }

  // ===== UPDATE =====
  async update(id: number, userId: number, dto: UpdateAvisDto): Promise<Avis> {

    const avis = await this.avisRepository.findOne({
      where: { idavis: id },
      relations: ['client'],
    });

    if (!avis) throw new NotFoundException('Avis non trouvé');

    if (avis.client.iduser !== userId) {
      throw new ForbiddenException("Vous ne pouvez modifier que votre avis");
    }

    Object.assign(avis, dto);

    return this.avisRepository.save(avis);
  }

  // ===== DELETE =====
  async remove(id: number, userId: number, role: string) {

    const avis = await this.avisRepository.findOne({
      where: { idavis: id },
      relations: ['client'],
    });

    if (!avis) throw new NotFoundException('Avis non trouvé');

    if (role === 'client' && avis.client.iduser !== userId) {
      throw new ForbiddenException("Accès refusé");
    }

    return this.avisRepository.delete(id);
  }

  // ===== FILTER BY TYPE =====
  async consulterParType(type: string): Promise<Avis[]> {
    return this.avisRepository.find({
      where: { type },
      relations: ['client', 'admin'],
      order: { date_Avis: 'DESC' },
    });
  }

  // ===== FILTER BY TARGET =====
  async getAvisByTarget(type: string, targetId: number): Promise<Avis[]> {
    return this.avisRepository.find({
      where: { type, targetId },
      relations: ['client'],
      order: { date_Avis: 'DESC' },
    });
  }

  // ===== AVERAGE RATING =====
  async getAverageRating(type: string, targetId: number): Promise<number> {

    const avis = await this.avisRepository.find({
      where: { type, targetId },
    });

    if (avis.length === 0) return 0;

    const total = avis.reduce((sum, a) => sum + Number(a.note), 0);

    return Number((total / avis.length).toFixed(2));
  }
}