import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from '../entities/location.entity';
import { NotificationService } from '../notification/notification.service';
import { FactureService } from '../facture/facture.service';
import { Agence } from '../entities/agence.entity';

import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private notificationService: NotificationService,
    private factureService: FactureService,
  ) {}

 async create(dto: CreateLocationDto, clientId: number): Promise<Location> {

  // Récupérer l'agence avec son manager
  const agence = await this.locationRepository.manager
    .getRepository('Agence')
    .findOne({ 
      where: { idagence: dto.idagence }, 
      relations: ['agenceManager'] 
    });

   const location = this.locationRepository.create({
     date_debut: dto.date_debut,
     date_fin: dto.date_fin,
     statut: 'en attente',
     montant: dto.montant,

     client: { iduser: clientId } as any,
     agence: { idagence: dto.idagence } as any,
     voiture: { idvoiture: dto.voitureId } as any,
     agenceManager: agence?.agenceManager,
   });

   return this.locationRepository.save(location);
 }
  // ===== CONFIRMER =====
  async confirmerLocation(id: number, clientId: number): Promise<void> {

    const location = await this.locationRepository.findOne({
      where: { idlocation: id },
     relations: ['client', 'voiture', 'agenceManager', 'agence'],
    });

    if (!location) throw new NotFoundException('Location non trouvée');

    location.statut = 'confirmée';
    await this.locationRepository.save(location);

    await this.factureService.createFacture(undefined, location.idlocation);

    await this.notificationService.create({
      clientId,
      message: "Votre location est confirmée avec facture",
      type: "location",
      senderRole: 'agence-manager',
      senderId: location.agenceManager?.iduser ?? undefined
    });
  }

  // ===== ANNULER =====
  async annulerLocation(id: number, clientId: number): Promise<void> {

    await this.locationRepository.update(id, { statut: 'annulée' });

    await this.notificationService.create({
      clientId,
      message: "Votre location a été annulée",
      type: "location",
      senderRole: 'agence-manager',
      senderId: undefined
    });
  }

  // ===== UPDATE =====
  async updateDates(
    id: number,
    userId: number,
    role: string,
    dto: UpdateLocationDto
  ): Promise<Location> {

    const location = await this.locationRepository.findOne({
      where: { idlocation: id },
      relations: ['agenceManager'],
    });

    if (!location) throw new NotFoundException('Location non trouvée');

    if (role !== 'agence-manager')
      throw new ForbiddenException("Accès refusé");

    if (location.agenceManager.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    if (dto.date_debut) location.date_debut = dto.date_debut;
    if (dto.date_fin) location.date_fin = dto.date_fin;
    if (dto.statut) location.statut = dto.statut;

    return this.locationRepository.save(location);
  }

  // ===== FIND ALL =====
  async findAll(userId: number, role: string): Promise<Location[]> {

    if (role === 'admin') {
      return this.locationRepository.find({
        relations: ['client','agenceManager','voiture','facture','agence'],
      });
    }

    if (role === 'client') {
      return this.locationRepository.find({
        where: { client: { iduser: userId } },
        relations: ['client','agenceManager','voiture','facture','agence'],
      });
    }

    // ✅ agence-manager
    if (role === 'agence-manager') {
      return this.locationRepository.createQueryBuilder('location')
        .leftJoinAndSelect('location.client', 'client')
        .leftJoinAndSelect('location.agenceManager', 'agenceManager')
        .leftJoinAndSelect('location.voiture', 'voiture')
        .leftJoinAndSelect('location.facture', 'facture')
        .leftJoinAndSelect('location.agence', 'agence')
        .where('agenceManager.iduser = :userId', { userId })
        .getMany();
    }

    return [];
  }

  // ===== FIND ONE =====
  async findOne(id: number, userId: number, role: string): Promise<Location> {

    const location = await this.locationRepository.findOne({
      where: { idlocation: id },
      relations: ['client','agenceManager','voiture','facture','agence'],
    });

    if (!location) throw new NotFoundException('Location non trouvée');

    if (role === 'client' && location.client.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    if (role === 'agence-manager' && location.agenceManager.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    return location;
  }

  // ===== DELETE =====
  async remove(id: number, userId: number, role: string) {

    const location = await this.locationRepository.findOne({
      where: { idlocation: id },
      relations: ['agenceManager'],
    });

    if (!location) throw new NotFoundException('Location non trouvée');

    if (role === 'admin') {
      return this.locationRepository.delete(id);
    }

    if (role === 'agence-manager') {
      if (location.agenceManager.iduser !== userId) {
        throw new ForbiddenException("Accès refusé");
      }
      return this.locationRepository.delete(id);
    }

    throw new ForbiddenException("Accès refusé");
  }
}