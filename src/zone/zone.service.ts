import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Zone } from '../entities/zone.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';

import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneFilterDto } from './dto/zone-filter.dto';

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

  // ================= CREATE ZONE =================
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

    // 🔔 Notifications
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

  // ================= FIND ALL (SIMPLE) =================
  async findAll(): Promise<Zone[]> {
    return this.zoneRepository.find({
      relations: ['admin'],
    });
  }

  // ================= 🔥 ADVANCED SEARCH =================
  async findAdvanced(filter: ZoneFilterDto) {

    const {
      search,
      ville,
      page = 1,
      limit = 10,
      sortBy = 'idzone',
      order = 'ASC',
    } = filter;

    // 🔒 Sécurité tri
    const allowedSortFields = ['idzone', 'nom', 'ville'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new Error('Invalid sort field');
    }

    const query = this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.admin', 'admin');

    // 🔍 SEARCH GLOBAL
    if (search) {
      query.andWhere(
        '(zone.nom LIKE :search OR zone.ville LIKE :search OR zone.description LIKE :search)',
        { search: '%' + search + '%' },
      );
    }

    // 🎯 FILTRAGE
    if (ville) {
      query.andWhere('zone.ville LIKE :ville', {
        ville: '%' + ville + '%',
      });
    }

    // 🔄 SORTING — FIX: concaténation à la place du template literal
    query.orderBy('zone.' + sortBy, order);

    // 📄 PAGINATION — FIX: expressions arithmétiques directes
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // ================= LOCALISATION =================
  async getLocalisationPublic() {
    const zones = await this.zoneRepository.find({
      select: ['idzone', 'nom', 'latitude', 'longitude'],
    });

    return zones.map((z) => ({
      id: z.idzone,
      nom: z.nom,
      latitude: z.latitude,
      longitude: z.longitude,
    }));
  }

  // ================= FIND ONE =================
  async findOne(id: number): Promise<Zone> {

    const zone = await this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });

    if (!zone) throw new NotFoundException('Zone non trouvee');

    return zone;
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateZoneDto): Promise<Zone> {

    await this.zoneRepository.update(id, dto);

    const zone = await this.zoneRepository.findOne({
      where: { idzone: id },
      relations: ['admin'],
    });

    if (!zone) throw new NotFoundException('Zone non trouvee');

    return zone;
  }

  // ================= DELETE =================
  async remove(id: number) {
    return this.zoneRepository.delete(id);
  }
}