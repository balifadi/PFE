import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Chambre } from '../entities/chambre.entity';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  // créer une chambre
  async create(chambre: Partial<Chambre>): Promise<Chambre> {
    const newChambre = this.chambreRepository.create(chambre);
    return await this.chambreRepository.save(newChambre);
  }

  // lister toutes les chambres
  async findAll(): Promise<Chambre[]> {
    return await this.chambreRepository.find({
      relations: ['hotelManager', 'hotel', 'reservation'],
    });
  }

  // chambre par ID
  async findOne(id: number): Promise<Chambre | null> {
    return await this.chambreRepository.findOne({
      where: { idchambre: id },
      relations: ['hotelManager', 'hotel', 'reservation'],
    });
  }

  // mettre à jour chambre
  async update(id: number, data: Partial<Chambre>): Promise<Chambre | null> {
    await this.chambreRepository.update(id, data);
    return this.findOne(id);
  }

  // supprimer chambre
  async remove(id: number) {
    return await this.chambreRepository.delete(id);
  }

  // modifier prix par nuit
  async updatePrixNuit(id: number, prix: number) {
    await this.chambreRepository.update(id, { prix_Nuit: prix });
    return this.findOne(id);
  }

  // modifier état
  async updateEtatChambre(id: number, etat: string) {
    await this.chambreRepository.update(id, { etat });
    return this.findOne(id);
  }

  // modifier capacité
  async updateCapacite(id: number, capacite: number) {
    await this.chambreRepository.update(id, { capacite });
    return this.findOne(id);
  }

  // vérifier disponibilité chambre
  async verifierDisponibilite(
    id: number,
    dateDebut: Date,
    dateFin: Date,
  ): Promise<boolean> {
    const reservations = await this.reservationRepository.find({
      where: {
        chambres: { idchambre: id },
        date_debut: LessThan(dateFin),
        date_fin: MoreThan(dateDebut),
      },
    });
    return reservations.length === 0;
  }
}