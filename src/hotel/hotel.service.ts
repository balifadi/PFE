import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hotel } from '../entities/hotel.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';
import { ChambreService } from '../chambre/chambre.service';

import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelFilterDto } from './dto/hotel-filter.dto';

@Injectable()
export class HotelService {

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
    private chambreService: ChambreService,
  ) {}

  // ================= CREATE HOTEL =================
  async create(dto: CreateHotelDto, adminId: number): Promise<Hotel> {

    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const hotel = this.hotelRepository.create({
      ...dto,
      admin,
      hotelManager: dto.hotelManagerId ? { iduser: dto.hotelManagerId } : undefined,
    });

    const saved = await this.hotelRepository.save(hotel);

    // 🛏️ CRÉATION AUTOMATIQUE DES CHAMBRES PAR DÉFAUT
    if (saved.nb_chambres && saved.nb_chambres > 0) {
      const adminUser = { id: adminId, role: 'admin' };
      
      for (let i = 1; i <= saved.nb_chambres; i++) {
        await this.chambreService.create({
          hotelId: saved.idhotel,
          numero: i,
          capacite: 2,
          etat: 'disponible',
          prix_Nuit: 120
        }, adminUser);
      }
    }

    // 🔔 Notifications
    const clients = await this.clientRepository.find();

    for (const client of clients) {
      await this.notificationService.create({
        clientId: client.iduser,
        message: 'Nouvel hotel ajoute : ' + saved.nom,
        type: 'hotel',
        senderRole: 'admin',
        senderId: adminId,
      });
    }

    return saved;
  }

  // ================= FIND ALL (ROLE BASED) =================
  async findAll(userId: number, role: string): Promise<Hotel[]> {

    if (role === 'admin' || role === 'client') {
      return this.hotelRepository.find({
        relations: ['admin', 'chambres', 'hotelManager'],
      });
    }

    if (role === 'hotel-manager') {
      return this.hotelRepository.createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.admin', 'admin')
        .leftJoinAndSelect('hotel.chambres', 'chambres')
        .leftJoinAndSelect('hotel.hotelManager', 'hotelManager')
        .where('hotelManager.iduser = :userId', { userId })
        .getMany();
    }

    throw new ForbiddenException('Acces refuse');
  }

  // ================= 🔥 ADVANCED SEARCH =================
  async findAdvanced(filter: HotelFilterDto) {

    const {
      search,
      ville,
      nb_Etoiles,
      nb_chambres,
      page = 1,
      limit = 10,
      sortBy = 'idhotel',
      order = 'ASC',
    } = filter;

    // 🔒 Sécurisation tri
    const allowedSortFields = ['idhotel', 'nom', 'ville', 'nb_Etoiles', 'nb_chambres'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new Error('Invalid sort field');
    }

    const query = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.admin', 'admin')
      .leftJoinAndSelect('hotel.chambres', 'chambres')
      .leftJoinAndSelect('hotel.hotelManager', 'hotelManager');

    // 🔍 SEARCH GLOBAL
    if (search) {
      query.andWhere(
        '(hotel.nom LIKE :search OR hotel.ville LIKE :search)',
        { search: '%' + search + '%' },
      );
    }

    // 🎯 FILTRAGE
    if (ville) {
      query.andWhere('hotel.ville LIKE :ville', {
        ville: '%' + ville + '%',
      });
    }

    if (nb_Etoiles) {
      query.andWhere('hotel.nb_Etoiles = :nb', {
        nb: nb_Etoiles,
      });
    }

    if (nb_chambres) {
      query.andWhere('hotel.nb_chambres = :nbCh', {
        nbCh: nb_chambres,
      });
    }

    // 🔄 SORTING — FIX: concaténation à la place du template literal
    query.orderBy('hotel.' + sortBy, order);

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

  // ================= LOCALISATION PUBLIC =================
  async getLocalisationPublic() {
    const hotels = await this.hotelRepository.find({
      select: ['idhotel', 'nom', 'latitude', 'longitude'],
    });

    return hotels.map((h) => ({
      id: h.idhotel,
      nom: h.nom,
      latitude: h.latitude,
      longitude: h.longitude,
    }));
  }

  // ================= FIND ONE =================
  async findOneByUser(id: number, userId: number, role: string): Promise<Hotel> {

    const hotel = await this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['admin', 'chambres', 'hotelManager'],
    });

    if (!hotel) throw new NotFoundException('Hotel non trouve');

    if (role === 'hotel-manager' && hotel.hotelManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    return hotel;
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateHotelDto): Promise<Hotel> {
    // Normalize incoming DTO keys to match entity property names
    const normalize = (s: string) =>
      s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/__+/g, '_');

    const columns = this.hotelRepository.metadata.columns.map((c) => c.propertyName);
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
      await this.hotelRepository.update(id, payload);
    }

    const updated = await this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['admin', 'chambres', 'hotelManager'],
    });

    if (!updated) throw new NotFoundException('Hotel non trouve');

    return updated;
  }

  // ================= DELETE =================
  async remove(id: number) {
    return this.hotelRepository.delete(id);
  }
}