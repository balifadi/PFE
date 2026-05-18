
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

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
    private readonly factureRepository: Repository<Facture>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,

    private readonly notificationService: NotificationService,
  ) {}

  // =====================================================
  // 🔵 CREATE MANUAL FACTURE
  // =====================================================
  async create(dto: CreateFactureDto): Promise<Facture> {
    // ✅ Utilisation de la fonction centrale de calcul du montant total
    const montantTotal = await this.calculerMontantTotal(dto.reservationId, dto.locationId);

    const facture = this.factureRepository.create({
      client: { iduser: dto.clientId } as any,
      reservation: dto.reservationId
        ? ({ idreservation: dto.reservationId } as any)
        : undefined,
      location: dto.locationId
        ? ({ idlocation: dto.locationId } as any)
        : undefined,
      mode_Paiement: dto.mode_Paiement,
      montant_Total: montantTotal,
      date_Facture: dto.date_Facture,
      statut: dto.statut ?? 'non payee',
    });

    const saved = await this.factureRepository.save(facture);

    await this.notifyClient(
      dto.clientId,
      `Facture créée avec succès. Montant: ${saved.montant_Total} DT`,
    );

    return saved;
  }

  // =====================================================
  // 🔵 CREATE AUTO FACTURE
  // =====================================================
  async createFacture(reservationId?: number, locationId?: number): Promise<Facture> {
    if (!reservationId && !locationId) {
      throw new BadRequestException(
        'Une réservation ou une location est requise pour générer une facture',
      );
    }

    const reservation = reservationId
      ? await this.getReservation(reservationId)
      : undefined;

    const location = locationId
      ? await this.getLocation(locationId)
      : undefined;

    const existingFacture = reservationId
      ? await this.factureRepository.findOne({
          where: {
            reservation: { idreservation: reservationId },
          },
          relations: ['client', 'reservation', 'location'],
        })
      : await this.factureRepository.findOne({
          where: {
            location: { idlocation: locationId! },
          },
          relations: ['client', 'reservation', 'location'],
        });

    if (existingFacture) {
      return existingFacture;
    }

    const client = reservation?.client || location?.client;

    if (!client) {
      throw new NotFoundException('Client introuvable');
    }

    // ✅ Utilisation de la fonction centrale de calcul du montant total
    const montantTotal = await this.calculerMontantTotal(reservationId, locationId);

    const facture = this.factureRepository.create({
      client,
      reservation,
      location,
      montant_Total: montantTotal,
      mode_Paiement: 'Non payé',
      statut: 'non payee',
      date_Facture: new Date(),
    });

    const saved = await this.factureRepository.save(facture);

    await this.notifyClient(
      client.iduser,
      `Facture générée automatiquement. Montant total: ${montantTotal} DT`,
    );

    return saved;
  }

  // =====================================================
  // 🔵 PAIEMENT
  // =====================================================
  async payer(id: number, userId: number): Promise<Facture> {
    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
      relations: ['client'],
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    if (facture.client.iduser !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    if (facture.statut === 'payee') {
      throw new ForbiddenException('Facture déjà payée');
    }

    facture.statut = 'payee';

    const saved = await this.factureRepository.save(facture);

    await this.notifyClient(
      facture.client.iduser,
      `Paiement effectué avec succès. Facture #${id}`,
    );

    return saved;
  }

  // =====================================================
  // 🔵 UPDATE
  // =====================================================
  async update(id: number, dto: UpdateFactureDto): Promise<Facture> {
    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
      relations: ['client'],
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    if (dto.statut) facture.statut = dto.statut;
    if (dto.montant_Total !== undefined)
      facture.montant_Total = dto.montant_Total;
    if (dto.date_Facture) facture.date_Facture = dto.date_Facture;

    const saved = await this.factureRepository.save(facture);

    await this.notifyClient(
      facture.client.iduser,
      `Facture mise à jour. Montant: ${saved.montant_Total} DT, Statut: ${saved.statut}`,
    );

    return saved;
  }

  // =====================================================
  // 🔵 FIND ALL
  // =====================================================
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

  // =====================================================
  // 🔵 FIND ONE
  // =====================================================
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

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    if (role === 'client' && facture.client.iduser !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    if (
      role === 'hotel-manager' &&
      facture.reservation?.hotelManager?.iduser !== userId
    ) {
      throw new ForbiddenException('Accès refusé');
    }

    if (
      role === 'agence-manager' &&
      facture.location?.agenceManager?.iduser !== userId
    ) {
      throw new ForbiddenException('Accès refusé');
    }

    return facture;
  }

  // =====================================================
  // 🔵 CALCUL MONTANT TOTAL FACTURE
  // =====================================================
  
  /**
   * Calcule le montant total de la facture = montant réservation + montant location
   * @param reservationId ID de la réservation (optionnel)
   * @param locationId ID de la location (optionnel)
   * @returns Montant total calculé
   */
  async calculerMontantTotal(reservationId?: number, locationId?: number): Promise<number> {
    const reservation = reservationId
      ? await this.getReservation(reservationId)
      : undefined;

    const location = locationId
      ? await this.getLocation(locationId)
      : undefined;

    const montantReservation = reservation
      ? this.calculateReservationAmount(reservation)
      : 0;

    const montantLocation = location
      ? this.calculateLocationAmount(location)
      : 0;

    // ✅ Montant total = somme des montants de réservation et location
    return montantReservation + montantLocation;
  }

  // =====================================================
  // 🔵 REMOVE (Admin only)
  // =====================================================
  async remove(id: number): Promise<{ message: string }> {
    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
    });

    if (!facture) {
      throw new NotFoundException('Facture introuvable');
    }

    await this.factureRepository.remove(facture);

    return { message: `Facture #${id} supprimée avec succès` };
  }

  // =====================================================
  // 🔵 HELPERS
  // =====================================================

  private async getReservation(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['client', 'chambres'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    return reservation;
  }

  private async getLocation(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { idlocation: id },
      relations: ['client', 'voiture'],
    });

    if (!location) {
      throw new NotFoundException('Location introuvable');
    }

    return location;
  }

  private calculateReservationAmount(reservation: Reservation): number {
    const nbJours = this.calculateDays(
      reservation.date_debut,
      reservation.date_fin,
    );

    return (
      reservation.chambres?.reduce((sum, c: any) => {
        return sum + (c.prix_Nuit || 0) * nbJours;
      }, 0) || 0
    );
  }

  private calculateLocationAmount(location: Location): number {
    const nbJours = this.calculateDays(
      location.date_debut,
      location.date_fin,
    );

    return (location.voiture?.prix_Jour || 0) * nbJours;
  }

  private calculateDays(start: Date, end: Date): number {
    return Math.max(
      1,
      Math.ceil(
        (new Date(end).getTime() - new Date(start).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
  }

  private async notifyClient(clientId: number, message: string) {
    await this.notificationService.create({
      clientId,
      message,
      type: 'facture',
      senderRole: 'system',
      senderId: undefined,
    });
  }
}
