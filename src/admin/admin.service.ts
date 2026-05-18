import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { Hotel } from '../entities/hotel.entity';
import { Agence } from '../entities/agence.entity';
import { Reservation } from '../entities/reservation.entity';
import { Facture } from '../entities/facture.entity';
import { Zone } from '../entities/zone.entity';
import { Notification } from '../entities/notification.entity';
import { Avis } from '../entities/avis.entity';
import { Location } from '../entities/location.entity';
import { Voiture } from '../entities/voiture.entity';
import { Chambre } from '../entities/chambre.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,

    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,

    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @InjectRepository(Avis)
    private avisRepository: Repository<Avis>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    @InjectRepository(Voiture)
    private voitureRepository: Repository<Voiture>,

    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,
  ) {}

  // ✅ DASHBOARD
  async getDashboardStats() {
    return {
      admins: await this.adminRepository.count(),
      users: await this.clientRepository.count(),
      hotels: await this.hotelRepository.count(),
      agences: await this.agenceRepository.count(),
      reservations: await this.reservationRepository.count(),
      facturesPayees: await this.factureRepository.count({
        where: [
          { statut: 'payee' },
          { statut: 'payée' },
        ],
      }),
      zones: await this.zoneRepository.count(),
      notifications: await this.notificationRepository.count(),
      avis: await this.avisRepository.count(),
      locations: await this.locationRepository.count(),
      voitures: await this.voitureRepository.count(),
      chambres: await this.chambreRepository.count(),
    };
  }

  // ✅ GET ALL
  async findAll(currentUser: any): Promise<Admin[]> {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }
    return this.adminRepository.find({
      relations: ['zones', 'hotels', 'agences', 'notifications', 'avis'],
    });
  }
}
