import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Voiture } from '../entities/voiture.entity';
import { Location } from '../entities/location.entity';
import { Agence } from '../entities/agence.entity';
import { AgenceManager } from '../entities/agence-manager.entity';

@Injectable()
export class VoitureService {
  constructor(
    @InjectRepository(Voiture)
    private readonly voitureRepository: Repository<Voiture>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // ===============================
  // créer une voiture
  // ===============================
  async create(voiture: Partial<Voiture>): Promise<Voiture> {
    const newVoiture = this.voitureRepository.create(voiture);
    return await this.voitureRepository.save(newVoiture);
  }

  // ===============================
  // lister toutes les voitures
  // ===============================
  async findAll(): Promise<Voiture[]> {
    return await this.voitureRepository.find({
      relations: ['agenceManager', 'agence', 'location'],
    });
  }

  // ===============================
  // voiture par ID
  // ===============================
  async findOne(id: number): Promise<Voiture | null> {
    return await this.voitureRepository.findOne({
      where: { idvoiture: id },
      relations: ['agenceManager', 'agence', 'location'],
    });
  }

  // ===============================
  // mettre à jour voiture
  // ===============================
  async update(id: number, data: Partial<Voiture>): Promise<Voiture | null> {
    await this.voitureRepository.update(id, data);
    return this.findOne(id);
  }

  // ===============================
  // supprimer voiture
  // ===============================
  async remove(id: number) {
    return await this.voitureRepository.delete(id);
  }

  // ===============================
  // modifier prix par jour
  // ===============================
  async updatePrixJour(id: number, prix: number) {
    await this.voitureRepository.update(id, { prix_Jour: prix });
    return this.findOne(id);
  }

  // ===============================
  // modifier état
  // ===============================
  async updateEtatVoiture(id: number, etat: string) {
    await this.voitureRepository.update(id, { etat });
    return this.findOne(id);
  }

  // ===============================
  // vérifier disponibilité
  // ===============================
  async verifierDisponibilite(
    id: number,
    dateDebut: Date,
    dateFin: Date,
  ): Promise<boolean> {
    const locations = await this.locationRepository.find({
      where: {
        voiture: { idvoiture: id },
        date_debut: LessThan(dateFin),
        date_fin: MoreThan(dateDebut),
      },
    });
    return locations.length === 0;
  }
}
