import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../entities/zone.entity';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private notificationService: NotificationService,
  ) {}

  // ===============================
  // ajouter zone touristique
  // ===============================
  async create(
    zone: Partial<Zone>,
    clientId: number,
  ): Promise<Zone> {
    const admin = await this.adminRepository.findOne({
      where: { iduser: (zone as any).adminId },
    });

    const newZone = this.zoneRepository.create({
      ...zone,
      admin: admin!, // relation admin
    });

    const savedZone = await this.zoneRepository.save(newZone);

    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Nouvelle zone touristique ajoutée : " + savedZone.nom,
      "zone"
    );

    return savedZone;
  }

  async findAll(): Promise<Zone[]> {
    return this.zoneRepository.find({ relations: ['admin'] });
  }

  async findOne(id: number): Promise<Zone | null> {
    return this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });
  }

  async update(id: number, data: Partial<Zone>) {
    return this.zoneRepository.update(id, data);
  }

  async remove(id: number) {
    return this.zoneRepository.delete(id);
  }
}