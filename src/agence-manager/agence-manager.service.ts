import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenceManager } from '../entities/agence-manager.entity';

@Injectable()
export class AgenceManagerService {

  constructor(
    @InjectRepository(AgenceManager)
    private agenceManagerRepository: Repository<AgenceManager>,
  ) {}

  async findAll(currentUser: any): Promise<AgenceManager[]> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }

    return this.agenceManagerRepository.find({
      relations: ['voitures', 'locations'],
    });
  }

  async findOne(id: number, currentUser: any): Promise<AgenceManager | null> {

    if (currentUser.role === 'agence-manager' && currentUser.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    if (!['admin', 'agence-manager'].includes(currentUser.role)) {
      throw new ForbiddenException('Access denied');
    }

    return this.agenceManagerRepository.findOne({
      where: { iduser: id },
      relations: ['voitures', 'locations'],
    });
  }
}