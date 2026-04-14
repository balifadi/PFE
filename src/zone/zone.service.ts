import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Zone } from '../entities/zone.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZoneService {

  constructor(
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateZoneDto, adminId: number): Promise<Zone> {

    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const zone = this.zoneRepository.create({
      ...dto,
      admin,
    });

    const saved = await this.zoneRepository.save(zone);

    const clients = await this.clientRepository.find();

    for (const client of clients) {
      await this.notificationService.create({
        clientId: client.iduser,
        message: 'Nouvelle zone touristique ajoutee : ' + saved.nom,
        type: 'zone',
        senderId: adminId,
        senderRole: 'admin',
      });
    }

    return saved;
  }

  async findAll(): Promise<Zone[]> {
    return this.zoneRepository.find({
      relations: ['admin'],
    });
  }


  // ================= GET LOCALISATION PUBLIC (visiteurs) =================
async getLocalisationPublic() {
  const zones = await this.zoneRepository.find({
    select: ['idzone', 'nom', 'latitude', 'longitude'],
  });

  return zones.map(z => ({
    id: z.idzone,
    nom: z.nom,
    latitude: z.latitude,
    longitude: z.longitude,
  }));
}


  async findOne(id: number): Promise<Zone> {
    const zone = await this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });

    if (!zone) throw new NotFoundException('Zone non trouvee');

    return zone;
  }

  async update(id: number, dto: UpdateZoneDto): Promise<Zone> {
    await this.zoneRepository.update(id, dto);

    const zone = await this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });

    if (!zone) throw new NotFoundException('Zone non trouvee');

    return zone;
  }

  async remove(id: number) {
    return this.zoneRepository.delete(id);
  }
  



}