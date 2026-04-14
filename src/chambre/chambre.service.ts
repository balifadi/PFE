import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Chambre } from '../entities/chambre.entity';
import { Reservation } from '../entities/reservation.entity';
import { CreateChambreDto } from './dto/create-chambre.dto';
import { UpdateChambreDto } from './dto/update-chambre.dto';

@Injectable()
export class ChambreService {

  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  // ✅ CREATE
  async create(dto: CreateChambreDto, user: any): Promise<Chambre> {

    if (user.role === 'admin') {
      const chambre = this.chambreRepository.create({
        ...dto,
        hotel: { idhotel: dto.hotelId },
      });
      return this.chambreRepository.save(chambre);
    }

    if (user.role === 'hotel-manager') {
      const chambre = this.chambreRepository.create({
        ...dto,
        hotel: { idhotel: dto.hotelId },
        hotelManager: { iduser: user.id },
      });
      return this.chambreRepository.save(chambre);
    }

    throw new ForbiddenException("Accès refusé");
  }

  // ✅ FIND ALL
  async findAll(userId: number, role: string): Promise<Chambre[]> {

    if (role === 'admin') {
      return this.chambreRepository.find({
        relations: ['hotelManager', 'hotel', 'reservation'],
      });
    }

    if (role === 'hotel-manager') {
      return this.chambreRepository.find({
        where: { hotelManager: { iduser: userId } },
        relations: ['hotelManager', 'hotel', 'reservation'],
      });
    }

    // client + agence-manager
    return this.chambreRepository.find({
      relations: ['hotel', 'reservation'],
    });
  }

  // ✅ FIND ONE
  async findOne(id: number, userId: number, role: string): Promise<Chambre> {

    const chambre = await this.chambreRepository.findOne({
      where: { idchambre: id },
      relations: ['hotelManager', 'hotel', 'reservation', 'reservation.client'],
    });

    if (!chambre) throw new NotFoundException('Chambre non trouvée');

    if (role === 'hotel-manager' && chambre.hotelManager?.iduser !== userId) {
      throw new ForbiddenException("Accès refusé");
    }

    return chambre;
  }

  // ✅ UPDATE
  async update(id: number, user: any, dto: UpdateChambreDto): Promise<Chambre> {

    const chambre = await this.chambreRepository.findOne({
      where: { idchambre: id },
      relations: ['hotelManager'],
    });

    if (!chambre) throw new NotFoundException('Chambre non trouvée');

    if (user.role === 'admin') {
      await this.chambreRepository.update(id, dto);
      return this.findOne(id, user.id, user.role);
    }

    if (user.role === 'hotel-manager') {
      if (chambre.hotelManager?.iduser !== user.id) {
        throw new ForbiddenException("Vous ne pouvez modifier que vos chambres");
      }

      await this.chambreRepository.update(id, dto);
      return this.findOne(id, user.id, user.role);
    }

    throw new ForbiddenException("Accès refusé");
  }

  // ✅ DELETE
  async remove(id: number, user: any): Promise<void> {

    const chambre = await this.chambreRepository.findOne({
      where: { idchambre: id },
    });

    if (!chambre) throw new NotFoundException('Chambre non trouvée');

    if (user.role !== 'admin') {
      throw new ForbiddenException("Seul l'admin peut supprimer");
    }

    await this.chambreRepository.delete(id);
  }

  // ✅ DISPONIBILITÉ
  async verifierDisponibilite(id: number, dateDebut: Date, dateFin: Date): Promise<{ disponible: boolean }> {

    const reservations = await this.reservationRepository.find({
      where: {
        chambres: { idchambre: id },
        date_debut: LessThan(dateFin),
        date_fin: MoreThan(dateDebut),
      },
    });

    return { disponible: reservations.length === 0 };
  }
}