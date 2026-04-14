import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Agence } from '../entities/agence.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';

import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

@Injectable()
export class AgenceService {

  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateAgenceDto, adminId: number): Promise<Agence> {

    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const agence = this.agenceRepository.create({
      ...dto,
      admin,
    });

    const saved = await this.agenceRepository.save(agence);

    const clients = await this.clientRepository.find();

    for (const client of clients) {
      await this.notificationService.create({
        clientId: client.iduser,
        message: 'Nouvelle agence ajoutee : ' + saved.nom,
        type: 'agence',
        senderRole: 'admin',
        senderId: adminId,
      });
    }

    return saved;
  }

  async findAll(userId: number, role: string): Promise<Agence[]> {

    if (role === 'admin' || role === 'client') {
      return this.agenceRepository.find({
        relations: ['admin', 'voitures', 'agenceManager'],
      });
    }

    if (role === 'agence-manager') {
      return this.agenceRepository.find({
        where: { agenceManager: { iduser: userId } },
        relations: ['admin', 'voitures', 'agenceManager'],
      });
    }

    throw new ForbiddenException('Acces refuse');
  }


// ================= GET LOCALISATION PUBLIC (visiteurs) =================
async getLocalisationPublic() {
  const agences = await this.agenceRepository.find({
    select: ['idagence', 'nom', 'latitude', 'longitude'],
  });

  return agences.map(a => ({
    id: a.idagence,
    nom: a.nom,
    latitude: a.latitude,
    longitude: a.longitude,
  }));
}


  async findOneByUser(id: number, userId: number, role: string): Promise<Agence> {

    const agence = await this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['admin', 'voitures', 'agenceManager'],
    });

    if (!agence) throw new NotFoundException('Agence non trouvee');

    if (role === 'agence-manager' && agence.agenceManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    return agence;
  }

  async update(id: number, dto: UpdateAgenceDto): Promise<Agence> {

    await this.agenceRepository.update(id, dto);

    const updated = await this.agenceRepository.findOne({
      where: { idagence: id },
      relations: ['admin', 'voitures', 'agenceManager'],
    });

    if (!updated) throw new NotFoundException('Agence non trouvee');

    return updated;
  }

  async remove(id: number) {
    return this.agenceRepository.delete(id);
  }



}