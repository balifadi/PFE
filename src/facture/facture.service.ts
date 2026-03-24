import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facture } from '../entities/facture.entity';
import { Reservation } from '../entities/reservation.entity';
import { Location } from '../entities/location.entity';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private readonly factureRepository: Repository<Facture>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // créer facture simple
  async create(factureData: Partial<Facture>): Promise<Facture> {
    const facture = this.factureRepository.create(factureData);
    return this.factureRepository.save(facture);
  }

  // créer facture depuis reservation ou location (query params optionnelles)
  async createFacture(
    reservationId?: number,
    locationId?: number
  ): Promise<Facture> {
    let reservation: Reservation | undefined;
    let location: Location | undefined;

    if (reservationId !== undefined) {
      reservation = await this.reservationRepository.findOne({
        where: { idreservation: reservationId },
        relations: ['client', 'chambres'],
      }) || undefined;
    }

    if (locationId !== undefined) {
      location = await this.locationRepository.findOne({
        where: { idlocation: locationId },
        relations: ['client', 'voiture'],
      }) || undefined;
    }

    const client = reservation?.client || location?.client;
    if (!client) throw new Error('Client non trouvé pour la facture');

    let montantTotal = 0;

    if (reservation?.chambres?.length) {
      const nbJours = Math.ceil(
        (new Date(reservation.date_fin).getTime() -
         new Date(reservation.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      montantTotal += reservation.chambres.reduce((sum, c) => sum + c.prix_Nuit * nbJours, 0);
    }

    if (location?.voiture) {
      const nbJours = Math.ceil(
        (new Date(location.date_fin).getTime() -
         new Date(location.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      montantTotal += location.voiture.prix_Jour * nbJours;
    }

    const facture = new Facture();
    facture.client = client;
    facture.reservation = reservation ?? undefined;
    facture.location = location ?? undefined;
    facture.montant_Total = montantTotal;
    facture.mode_Paiement = 'Non payé';
    facture.statut = 'non payée';
    facture.date_Facture = new Date();

    return this.factureRepository.save(facture);
  }

  async updateStatut(id: number, statut: string): Promise<Facture> {
    const facture = await this.factureRepository.findOneBy({ idfacture: id });
    if (!facture) throw new Error('Facture non trouvée');
    facture.statut = statut;
    return this.factureRepository.save(facture);
  }

  async calculerMontantTotal(id: number): Promise<number> {
    const facture = await this.factureRepository.findOne({
      where: { idfacture: id },
      relations: ['reservation', 'reservation.chambres', 'location', 'location.voiture'],
    });
    if (!facture) throw new Error('Facture non trouvée');

    let total = 0;

    if (facture.reservation?.chambres?.length) {
      const nbJours = Math.ceil(
        (new Date(facture.reservation.date_fin).getTime() -
         new Date(facture.reservation.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      total += facture.reservation.chambres.reduce((sum, c) => sum + c.prix_Nuit * nbJours, 0);
    }

    if (facture.location?.voiture) {
      const nbJours = Math.ceil(
        (new Date(facture.location.date_fin).getTime() -
         new Date(facture.location.date_debut).getTime()) / (1000 * 60 * 60 * 24)
      );
      total += facture.location.voiture.prix_Jour * nbJours;
    }

    facture.montant_Total = total;
    await this.factureRepository.save(facture);
    return total;
  }

  async findAll(): Promise<Facture[]> {
    return this.factureRepository.find({
      relations: ['client', 'reservation', 'location'],
    });
  }

  async findOne(id: number): Promise<Facture | null> {
    return this.factureRepository.findOne({
      where: { idfacture: id },
      relations: ['client', 'reservation', 'location'],
    });
  }
}