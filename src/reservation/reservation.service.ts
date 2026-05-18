import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from '../entities/reservation.entity';
import { Client } from '../entities/client.entity';
import { HotelManager } from '../entities/hotel-manager.entity';
import { Hotel } from '../entities/hotel.entity';
import { Chambre } from '../entities/chambre.entity';
import { NotificationService } from '../notification/notification.service';
import { FactureService } from '../facture/facture.service';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(HotelManager)
    private hotelManagerRepository: Repository<HotelManager>,

    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Chambre)
    private chambreRepository: Repository<Chambre>,

    private notificationService: NotificationService,
    private factureService: FactureService,
  ) {}
// ===== CREATE ===== //
async create(dto: CreateReservationDto, clientId: number): Promise<Reservation> {

  // Récupérer l'hotel avec son hotelManager
  const hotel = await this.hotelRepository.findOne({ 
    where: { idhotel: dto.idhotel }, 
    relations: ['hotelManager'] 
  });

  if (!hotel) {
    throw new NotFoundException('Hotel non trouvé');
  }

  const chambre = await this.chambreRepository.findOne({
    where: { idchambre: dto.chambreId },
    relations: ['hotel'],
  });

  if (!chambre) {
    throw new NotFoundException('Chambre non trouvée');
  }

  if (chambre.hotel?.idhotel !== hotel.idhotel) {
    throw new BadRequestException('La chambre sélectionnée ne dépend pas de cet hôtel');
  }

  const chambreStatus = String(chambre.etat ?? 'disponible').toLowerCase();
  if (chambreStatus !== 'disponible' && chambreStatus !== 'active') {
    throw new BadRequestException('La chambre sélectionnée est indisponible');
  }

  const reservation = this.reservationRepository.create({
    date_debut: dto.date_debut,
    date_fin: dto.date_fin,
    statut: 'en attente',
    montant: dto.montant,

    client: { iduser: clientId } as any,
    hotel: { idhotel: dto.idhotel } as any,
    hotelManager: hotel?.hotelManager,
  });

  const savedReservation = await this.reservationRepository.save(reservation);

  chambre.reservation = savedReservation;
  chambre.etat = 'occupee';
  await this.chambreRepository.save(chambre);

  await this.factureService.createFacture(savedReservation.idreservation, undefined);

  return this.findOne(savedReservation.idreservation, clientId, 'client');
}
  // ===== CONFIRMER =====
  async confirmerReservation(id: number, clientId: number): Promise<void> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
    relations: ['client','chambres','hotelManager','hotel'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    reservation.statut = 'confirmée';
    await this.reservationRepository.save(reservation);

    for (const chambre of reservation.chambres ?? []) {
      chambre.etat = 'occupee';
      chambre.reservation = reservation;
      await this.chambreRepository.save(chambre);
    }

    await this.factureService.createFacture(reservation.idreservation, undefined);

    await this.notificationService.create({
      clientId,
      message: "Votre réservation est confirmée et la facture a été créée automatiquement",
      type: "reservation",
      senderRole: 'hotel-manager',
      senderId: reservation.hotelManager?.iduser ?? undefined
    });
  }

  // ===== ANNULER =====
  async annulerReservation(id: number, clientId: number): Promise<void> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['chambres'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    reservation.statut = 'annulée';
    await this.reservationRepository.save(reservation);

    for (const chambre of reservation.chambres ?? []) {
      if ((chambre.etat || '').toLowerCase() !== 'maintenance') {
        chambre.etat = 'disponible';
      }
      chambre.reservation = null as any;
      await this.chambreRepository.save(chambre);
    }

    await this.notificationService.create({
      clientId,
      message: "Votre réservation a été annulée",
      type: "reservation",
      senderRole: 'hotel-manager',
      senderId: undefined
    });
  }

  // ===== UPDATE =====
  async updateDates(
    id: number,
    userId: number,
    role: string,
    dto: UpdateReservationDto
  ): Promise<Reservation> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['hotelManager'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    if (role !== 'hotel-manager')
      throw new ForbiddenException("Accès refusé");

    if (reservation.hotelManager.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    if (dto.date_debut) reservation.date_debut = dto.date_debut;
    if (dto.date_fin) reservation.date_fin = dto.date_fin;
    if (dto.statut) reservation.statut = dto.statut;

    return this.reservationRepository.save(reservation);
  }

  // ===== FIND ALL =====
  async findAll(userId: number, role: string): Promise<Reservation[]> {

    if (role === 'admin') {
      return this.reservationRepository.find({
        relations: ['client','hotelManager','chambres','facture','hotel'],
      });
    }

    if (role === 'client') {
      return this.reservationRepository.find({
        where: { client: { iduser: userId } },
      relations: ['client','hotelManager','chambres','facture','hotel'],
      });
    }

    if (role === 'hotel-manager') {
      return this.reservationRepository.createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.client', 'client')
        .leftJoinAndSelect('reservation.hotelManager', 'hotelManager')
        .leftJoinAndSelect('reservation.chambres', 'chambres')
        .leftJoinAndSelect('reservation.facture', 'facture')
        .leftJoinAndSelect('reservation.hotel', 'hotel')
        .where('hotelManager.iduser = :userId', { userId })
        .getMany();
    }

    return [];
  }

  // ===== FIND ONE =====
  async findOne(id: number, userId: number, role: string): Promise<Reservation> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['client','hotelManager','chambres','facture','hotel'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    if (role === 'client' && reservation.client.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    if (role === 'hotel-manager' && reservation.hotelManager.iduser !== userId)
      throw new ForbiddenException("Accès refusé");

    return reservation;
  }

  // ===== DELETE =====
  async remove(id: number, userId: number, role: string) {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['hotelManager'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    if (role === 'admin') {
      return this.reservationRepository.delete(id);
    }

    if (role === 'hotel-manager') {
      if (reservation.hotelManager.iduser !== userId) {
        throw new ForbiddenException("Accès refusé");
      }
      return this.reservationRepository.delete(id);
    }

    throw new ForbiddenException("Accès refusé");
  }
}
