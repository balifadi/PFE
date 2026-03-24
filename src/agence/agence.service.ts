import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agence } from '../entities/agence.entity';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AgenceService {
  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private notificationService: NotificationService,
  ) {}

  // ===============================
  // ajouter agence
  // ===============================
  async create(agence: Partial<Agence>, clientId: number): Promise<Agence> {
    const admin = await this.adminRepository.findOne({
      where: { iduser: (agence as any).adminId },
    });

    const newAgence = this.agenceRepository.create({
      ...agence,
      admin: admin!, // relation admin
    });

    const savedAgence = await this.agenceRepository.save(newAgence);

    // notification au client
    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Nouvelle agence ajoutée : " + savedAgence.nom,
      "agence"
    );

    return savedAgence;
  }

  async findAll(): Promise<Agence[]> {
    return this.agenceRepository.find({ relations: ['admin', 'voitures'] });
  }

  async findOne(id: number): Promise<Agence | null> {
    return this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['admin', 'voitures'],
    });
  }

  async update(id: number, data: Partial<Agence>) {
    return this.agenceRepository.update(id, data);
  }

  async remove(id: number) {
    return this.agenceRepository.delete(id);
  }
}