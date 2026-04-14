import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from '../entities/reservation.entity';
import { NotificationService } from '../notification/notification.service';
import { FactureService } from '../facture/facture.service';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private notificationService: NotificationService,
    private factureService: FactureService,
  ) {}

  // ===== CREATE =====
  async create(dto: CreateReservationDto): Promise<Reservation> {

    const reservation = this.reservationRepository.create({
      date_debut: dto.date_debut,
      date_fin: dto.date_fin,
      statut: 'en attente',

      chambres: [{ idchambre: dto.chambreId }] as any,
      hotelManager: { iduser: dto.hotelId } as any,
    });

    return this.reservationRepository.save(reservation);
  }

  // ===== CONFIRMER =====
  async confirmerReservation(id: number, clientId: number): Promise<void> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['client','chambres','hotelManager'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');

    reservation.statut = 'confirmée';
    await this.reservationRepository.save(reservation);

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

    await this.reservationRepository.update(id, { statut: 'annulée' });

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
        relations: ['client','hotelManager','chambres','facture'],
      });
    }

    if (role === 'client') {
      return this.reservationRepository.find({
        where: { client: { iduser: userId } },
        relations: ['client','hotelManager','chambres','facture'],
      });
    }

    if (role === 'hotel-manager') {
      return this.reservationRepository.find({
        where: { hotelManager: { iduser: userId } },
        relations: ['client','hotelManager','chambres','facture'],
      });
    }

    return [];
  }

  // ===== FIND ONE =====
  async findOne(id: number, userId: number, role: string): Promise<Reservation> {

    const reservation = await this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['client','hotelManager','chambres','facture'],
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