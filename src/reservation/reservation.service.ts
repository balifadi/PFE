import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private notificationService: NotificationService,
  ) {}

  // créer réservation
  async create(reservation: Partial<Reservation>): Promise<Reservation> {
    const newReservation = this.reservationRepository.create(reservation);
    return this.reservationRepository.save(newReservation);
  }

  // confirmer réservation
  async confirmerReservation(id: number, clientId: number): Promise<void> {
    await this.reservationRepository.update(id, { statut: 'confirmée' });

    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Votre réservation est confirmée",
      "reservation"
    );
  }

  // annuler réservation
  async annulerReservation(id: number, clientId: number): Promise<void> {
    await this.reservationRepository.update(id, { statut: 'annulée' });

    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Votre réservation a été annulée",
      "reservation"
    );
  }

  // lister toutes les réservations
  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['client', 'hotelManager', 'chambres', 'facture'],
    });
  }

  // réservation par id
  async findOne(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findOne({
      where: { idreservation: id },
      relations: ['client', 'hotelManager', 'chambres', 'facture'],
    });
  }

  // supprimer réservation
  async remove(id: number) {
    return this.reservationRepository.delete(id);
  }
}