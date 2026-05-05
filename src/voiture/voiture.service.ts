import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Voiture } from '../entities/voiture.entity';
import { Location } from '../entities/location.entity';
import { CreateVoitureDto } from './dto/create-voiture.dto';
import { UpdateVoitureDto } from './dto/update-voiture.dto';

@Injectable()
export class VoitureService {

  constructor(
    @InjectRepository(Voiture)
    private readonly voitureRepository: Repository<Voiture>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateVoitureDto, user: any): Promise<Voiture> {

    if (user.role === 'admin') {
      // Récupérer l'agence pour récupérer son manager automatiquement
      const agence = await this.voitureRepository.manager
        .getRepository('Agence')
        .findOne({
          where: { idagence: dto.agenceId },
          relations: ['agenceManager']
        });

      const voiture = this.voitureRepository.create({
        ...dto,
        agence: { idagence: dto.agenceId },
        agenceManager: agence?.agenceManager,
      });
      return this.voitureRepository.save(voiture);
    }

    if (user.role === 'agence-manager') {
      const voiture = this.voitureRepository.create({
        ...dto,
        agence: { idagence: dto.agenceId },
        agenceManager: { iduser: user.id },
      });
      return this.voitureRepository.save(voiture);
    }

    throw new ForbiddenException("Accès refusé");
  }

  // ✅ FIND ALL
  async findAll(userId: number, role: string): Promise<Voiture[]> {

    if (role === 'admin') {
      return this.voitureRepository.find({
        relations: ['agenceManager', 'agence', 'location'],
      });
    }

    if (role === 'agence-manager') {
      return this.voitureRepository.createQueryBuilder('voiture')
        .leftJoinAndSelect('voiture.agenceManager', 'agenceManager')
        .leftJoinAndSelect('voiture.agence', 'agence')
        .leftJoinAndSelect('voiture.location', 'location')
        .where('agenceManager.iduser = :userId', { userId })
        .getMany();
    }

    // client + hotel-manager
    return this.voitureRepository.find({
      relations: ['agence', 'location'],
    });
  }

  // ✅ FIND ONE
  async findOne(id: number, userId: number, role: string): Promise<Voiture> {
    const voiture = await this.voitureRepository.findOne({
      where: { idvoiture: id },
      relations: ['agenceManager', 'agence', 'location', 'location.client'],
    });

    if (!voiture) throw new NotFoundException('Voiture non trouvée');

    if (role === 'agence-manager' && voiture.agenceManager?.iduser !== userId) {
      throw new ForbiddenException("Accès refusé");
    }

    return voiture;
  }

  // ✅ UPDATE
  async update(id: number, user: any, dto: UpdateVoitureDto): Promise<Voiture> {

    const voiture = await this.voitureRepository.findOne({
      where: { idvoiture: id },
      relations: ['agenceManager'],
    });

    if (!voiture) throw new NotFoundException('Voiture non trouvée');

    if (user.role === 'admin') {
      await this.voitureRepository.update(id, dto);
      return this.findOne(id, user.id, user.role);
    }

    if (user.role === 'agence-manager') {
      if (voiture.agenceManager?.iduser !== user.id) {
        throw new ForbiddenException("Vous ne pouvez modifier que vos voitures");
      }

      await this.voitureRepository.update(id, dto);
      return this.findOne(id, user.id, user.role);
    }

    throw new ForbiddenException("Accès refusé");
  }

  // ✅ DELETE
  async remove(id: number, user: any): Promise<void> {

    const voiture = await this.voitureRepository.findOne({
      where: { idvoiture: id },
    });

    if (!voiture) throw new NotFoundException('Voiture non trouvée');

    if (user.role !== 'admin') {
      throw new ForbiddenException("Seul l'admin peut supprimer");
    }

    await this.voitureRepository.delete(id);
  }

  // ✅ DISPONIBILITÉ
  async verifierDisponibilite(id: number, dateDebut: Date, dateFin: Date): Promise<{ disponible: boolean }> {
    const locations = await this.locationRepository.find({
      where: {
        voiture: { idvoiture: id },
        date_debut: LessThan(dateFin),
        date_fin: MoreThan(dateDebut),
      },
    });

    return { disponible: locations.length === 0 };
  }
}     