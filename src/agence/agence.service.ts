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
import { VoitureService } from '../voiture/voiture.service';

import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { AgenceFilterDto } from './dto/agence-filter.dto';

@Injectable()
export class AgenceService {
  private readonly defaultAgencyImages = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  ];

  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
    private voitureService: VoitureService,
  ) {}

  private extractImageCandidate(dto: Record<string, any>): string | undefined {
    const candidates = [
      dto?.imagePath,
      dto?.image,
      ...(Array.isArray(dto?.images) ? dto.images : []),
    ];

    const selected = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
    return selected ? String(selected).trim() : undefined;
  }

  private resolveImagePath(imagePath: string | undefined, fallback: string): string {
    if (!imagePath) {
      return fallback;
    }

    const value = String(imagePath).trim();

    if (!value) {
      return fallback;
    }

    if (
      value.startsWith('http://') ||
      value.startsWith('https://') ||
      value.startsWith('data:') ||
      value.startsWith('assets/')
    ) {
      return value;
    }

    if (value.startsWith('/')) {
      return `http://localhost:3000${value}`;
    }

    return `http://localhost:3000/uploads/${value}`;
  }

  private pickFallbackImage(seed: string, list: string[]): string {
    if (!list.length) {
      return '';
    }

    const normalized = String(seed ?? '').trim();
    const hash = normalized.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return list[Math.abs(hash) % list.length];
  }

  // ================= CREATE =================
  async create(dto: CreateAgenceDto, adminId: number): Promise<Agence> {
    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const agence = this.agenceRepository.create({
      ...dto,
      imagePath: this.resolveImagePath(
        this.extractImageCandidate(dto as Record<string, any>),
        this.pickFallbackImage(`${dto.nom}-${dto.ville}`, this.defaultAgencyImages),
      ),
      admin,
      agenceManager: dto.agenceManagerId ? { iduser: dto.agenceManagerId } : undefined,
    });

    const saved = await this.agenceRepository.save(agence);

    // 🚗 CRÉATION AUTOMATIQUE DES VOITURES PAR DÉFAUT
    if (saved.nb_voitures && saved.nb_voitures > 0) {
      const adminUser = { id: adminId, role: 'admin' };
      
      for (let i = 1; i <= saved.nb_voitures; i++) {
        await this.voitureService.create({
          agenceId: saved.idagence,
          marque: 'BMW',
          modele: 'Série 3',
          immatriculation: `2${String(i).padStart(3, '0')} TUN 2630`,
          etat: 'disponible',
          prix_Jour: 200
        }, adminUser);
      }
    }

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
      return this.agenceRepository.createQueryBuilder('agence')
        .leftJoinAndSelect('agence.admin', 'admin')
        .leftJoinAndSelect('agence.voitures', 'voitures')
        .leftJoinAndSelect('agence.agenceManager', 'agenceManager')
        .where('agenceManager.iduser = :userId', { userId })
        .getMany();
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
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' && !value.trim()) continue;
      const realKey = mapping[normalize(key)];
      if (realKey) payload[realKey] = value;
    }

    const imageCandidate = this.extractImageCandidate(dto as Record<string, any>);
    if (imageCandidate) {
      payload.imagePath = this.resolveImagePath(imageCandidate, this.defaultAgencyImages[0]);
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
