import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Facture } from '../entities/facture.entity';
import { Reservation } from '../entities/reservation.entity';
import { Location } from '../entities/location.entity';
import { NotificationService } from '../notification/notification.service';

import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';

@Injectable()
export class FactureService {

  constructor(
    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    private notificationService: NotificationService,
  ) {}

  // ===== CREATE MANUEL =====
  async create(dto: CreateFactureDto): Promise<Facture> {

    const facture = this.factureRepository.create({
      client: { iduser: dto.clientId } as any,
      reservation: dto.reservationId ? { idreservation: dto.reservationId } as any : undefined,
      location: dto.locationId ? { idlocation: dto.locationId } as any : undefined,
      mode_Paiement: dto.mode_Paiement,
      montant_Total: dto.montant_Total,
      date_Facture: dto.date_Facture,
      statut: dto.statut ?? 'non payee',
    });

    const saved = await this.factureRepository.save(facture);

    await this.notificationService.create({
      clientId: dto.clientId,
      message: 'Votre facture a ete creee avec succes. Montant: ' + saved.montant_Total,
      type: 'facture',
      senderRole: 'system',
      senderId: undefined,
    });

    return saved;
  }

  // ===== CREATE AUTO (reservation/location) =====
  async createFacture(reservationId?: number, locationId?: number): Promise<Facture> {

    let reservation: Reservation | undefined;
    let location: Location | undefined;

    if (reservationId) {
      reservation = await this.reservationRepository.findOne({
        where: { idreservation: reservationId },
        relations: ['client', 'chambres', 'hotelManager'],
      }) || undefined;
    }

    if (locationId) {
      location = await this.locationRepository.findOne({
        where: { idlocation: locationId },
        relations: ['client', 'voiture', 'agenceManager'],
      }) || undefined;
    }

    const client = reservation?.client || location?.client;
    if (!client) throw new NotFoundException('Client non trouve');

    let montantTotal = 0;

    if (reservation?.chambres?.length) {
      const nbJours = Math.ceil(
        (new Date(reservation.date_fin).getTime() -
         new Date(reservation.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      montantTotal += reservation.chambres.reduce(
        (sum, c) => sum + c.prix_Nuit * nbJours,
        0
      );
    }

    if (location?.voiture) {
      const nbJours = Math.ceil(
        (new Date(location.date_fin).getTime() -
         new Date(location.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      montantTotal += location.voiture.prix_Jour * nbJours;
    }

    const facture = this.factureRepository.create({
      client,
      reservation,
      location,
      montant_Total: montantTotal,
      mode_Paiement: 'Non paye',
      statut: 'non payee',
      date_Facture: new Date(),
    });

    const saved = await this.factureRepository.save(facture);

    await this.notificationService.create({
      clientId: client.iduser,
      message: 'Votre facture a ete creee automatiquement. Montant: ' + saved.montant_Total,
      type: 'facture',
      senderRole: 'system',
      senderId: undefined,
    });

    return saved;
  }

    // ===== PAIEMENT SIMULÉ =====
  async payer(id: number, userId: number): Promise<Facture> {

  const facture = await this.factureRepository.findOne({
    where: { idfacture: id },
    relations: ['client'],
  });

  if (!facture) {
    throw new NotFoundException('Facture non trouvée');
  }

  // ✅ vérifier propriétaire
  if (facture.client.iduser !== userId) {
    throw new ForbiddenException('Accès refusé');
  }

  // ❌ empêcher double paiement
  if (facture.statut === 'payee') {
    throw new ForbiddenException('Facture déjà payée');
  }

  // ✅ paiement simulé
  facture.statut = 'payee';
  (facture as any).datePaiement = new Date();

  const saved = await this.factureRepository.save(facture);

  // 🔔 notification
  await this.notificationService.create({
    clientId: facture.client.iduser,
    message: 'Paiement effectué avec succès. Facture #' + id,
    type: 'facture',
    senderRole: 'system',
    senderId: undefined,
  });

  return saved;
}

  // ===== UPDATE =====
  async update(id: number, dto: UpdateFactureDto): Promise<Facture> {

    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
      relations: ['client'],
    });

    if (!facture) throw new NotFoundException('Facture non trouvee');

    if (dto.statut) facture.statut = dto.statut;
    if (dto.montant_Total !== undefined) facture.montant_Total = dto.montant_Total;
    if (dto.date_Facture) facture.date_Facture = dto.date_Facture;

    const saved = await this.factureRepository.save(facture);

    await this.notificationService.create({
      clientId: facture.client.iduser,
      message: 'Votre facture a ete mise a jour. Montant: ' + saved.montant_Total + ', Statut: ' + saved.statut,
      type: 'facture',
      senderRole: 'system',
      senderId: undefined,
    });

    return saved;
  }

  // ===== FIND ALL (ROLE BASED) =====
  async findAll(userId: number, role: string): Promise<Facture[]> {

    if (role === 'admin') {
      return this.factureRepository.find({
        relations: ['client', 'reservation', 'location'],
      });
    }

    if (role === 'client') {
      return this.factureRepository.find({
        where: { client: { iduser: userId } },
        relations: ['client', 'reservation', 'location'],
      });
    }

    if (role === 'hotel-manager') {
      return this.factureRepository
        .createQueryBuilder('facture')
        .leftJoinAndSelect('facture.reservation', 'reservation')
        .leftJoinAndSelect('reservation.hotelManager', 'hotelManager')
        .leftJoinAndSelect('facture.client', 'client')
        .where('hotelManager.iduser = :id', { id: userId })
        .getMany();
    }

    if (role === 'agence-manager') {
      return this.factureRepository
        .createQueryBuilder('facture')
        .leftJoinAndSelect('facture.location', 'location')
        .leftJoinAndSelect('location.agenceManager', 'agenceManager')
        .leftJoinAndSelect('facture.client', 'client')
        .where('agenceManager.iduser = :id', { id: userId })
        .getMany();
    }

    return [];
  }

  // ===== FIND ONE =====
  async findOne(id: number, userId: number, role: string): Promise<Facture> {

    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
      relations: [
        'client',
        'reservation',
        'reservation.hotelManager',
        'location',
        'location.agenceManager',
      ],
    });

    if (!facture) throw new NotFoundException('Facture non trouvee');

    if (role === 'client' && facture.client.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    if (role === 'hotel-manager' &&
        facture.reservation?.hotelManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    if (role === 'agence-manager' &&
        facture.location?.agenceManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    return facture;
  }
}