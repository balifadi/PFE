import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Agence } from '../entities/agence.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';

import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { AgenceFilterDto } from './dto/agence-filter.dto';

@Injectable()
export class AgenceService {
  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateAgenceDto, adminId: number): Promise<Agence> {
    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const agence = this.agenceRepository.create({
      ...dto,
      admin,
    });

    const saved = await this.agenceRepository.save(agence);

    // 🔔 Notifications
    const clients = await this.clientRepository.find();
    for (const client of clients) {
      await this.notificationService.create({
        clientId: client.iduser,
        message: 'Nouvelle agence ajoutee : ' + saved.nom,
        type: 'agence',
        senderRole: 'admin',
        senderId: adminId,
      });
    }

    return saved;
  }

  // ================= FIND ALL =================
  async findAll(userId: number, role: string): Promise<Agence[]> {
    if (role === 'admin' || role === 'client') {
      return this.agenceRepository.find({
        relations: ['admin', 'voitures', 'agenceManager'],
      });
    }

    if (role === 'agence-manager') {
      return this.agenceRepository.find({
        where: { agenceManager: { iduser: userId } },
        relations: ['admin', 'voitures', 'agenceManager'],
      });
    }

    throw new ForbiddenException('Acces refuse');
  }

  // ================= 🔥 ADVANCED SEARCH =================
  async findAdvanced(filter: AgenceFilterDto) {
    const {
      search,
      ville,
      nb_voitures,
      page = 1,
      limit = 10,
      sortBy = 'idagence',
      order = 'ASC',
    } = filter;

    // 🔒 Protection tri
    const allowedSortFields = ['idagence', 'nom', 'ville', 'nb_voitures'];
    if (!allowedSortFields.includes(sortBy)) {
      throw new Error('Invalid sort field');
    }

    const query = this.agenceRepository
      .createQueryBuilder('agence')
      .leftJoinAndSelect('agence.admin', 'admin')
      .leftJoinAndSelect('agence.voitures', 'voitures')
      .leftJoinAndSelect('agence.agenceManager', 'agenceManager');

    // 🔍 SEARCH
    if (search) {
      query.andWhere(
        '(agence.nom LIKE :search OR agence.ville LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 🎯 FILTRAGE
    if (ville) {
      query.andWhere('agence.ville LIKE :ville', {
        ville: `%${ville}%`,
      });
    }

    if (nb_voitures) {
      query.andWhere('agence.nb_voitures = :nb', {
        nb: nb_voitures,
      });
    }

    // 🔄 SORTING — FIX: use string concatenation to avoid template literal parse errors
    query.orderBy('agence.' + sortBy, order);

    // 📄 PAGINATION — FIX: use arithmetic expressions, not template literals
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
    const agences = await this.agenceRepository.find({
      select: ['idagence', 'nom', 'latitude', 'longitude'],
    });

    return agences.map((a) => ({
      id: a.idagence,
      nom: a.nom,
      latitude: a.latitude,
      longitude: a.longitude,
    }));
  }

  // ================= FIND ONE =================
  async findOneByUser(
    id: number,
    userId: number,
    role: string,
  ): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['admin', 'voitures', 'agenceManager'],
    });

    if (!agence) throw new NotFoundException('Agence non trouvee');

    if (role === 'agence-manager' && agence.agenceManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    return agence;
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateAgenceDto): Promise<Agence> {
    // Normalize incoming DTO keys to match entity property names
    const normalize = (s: string) =>
      s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/__+/g, '_');

    const columns = this.agenceRepository.metadata.columns.map((c) => c.propertyName);
    const mapping: Record<string, string> = {};
    for (const prop of columns) {
      mapping[normalize(prop)] = prop;
    }

    const payload: Record<string, any> = {};
    for (const [key, value] of Object.entries(dto as any)) {
      if (value === undefined) continue;
      const realKey = mapping[normalize(key)];
      if (realKey) payload[realKey] = value;
    }

    if (Object.keys(payload).length > 0) {
      await this.agenceRepository.update(id, payload);
    }

    const updated = await this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['admin', 'voitures', 'agenceManager'],
    });

    if (!updated) throw new NotFoundException('Agence non trouvee');

    return updated;
  }

  // ================= DELETE =================
  async remove(id: number) {
    return this.agenceRepository.delete(id);
  }
}