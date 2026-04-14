import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hotel } from '../entities/hotel.entity';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { NotificationService } from '../notification/notification.service';

import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelService {

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateHotelDto, adminId: number): Promise<Hotel> {

    const admin = await this.adminRepository.findOne({
      where: { iduser: adminId },
    });

    if (!admin) throw new NotFoundException('Admin non trouve');

    const hotel = this.hotelRepository.create({
      ...dto,
      admin,
    });

    const saved = await this.hotelRepository.save(hotel);

    const clients = await this.clientRepository.find();

    for (const client of clients) {
      await this.notificationService.create({
        clientId: client.iduser,
        message: 'Nouvel hotel ajoute : ' + saved.nom,
        type: 'hotel',
        senderRole: 'admin',
        senderId: adminId,
      });
    }

    return saved;
  }

  async findAll(userId: number, role: string): Promise<Hotel[]> {

    if (role === 'admin' || role === 'client') {
      return this.hotelRepository.find({
        relations: ['admin', 'chambres', 'hotelManager'],
      });
    }

    if (role === 'hotel-manager') {
      return this.hotelRepository.find({
        where: { hotelManager: { iduser: userId } },
        relations: ['admin', 'chambres', 'hotelManager'],
      });
    }

    throw new ForbiddenException('Acces refuse');
  }


  // ================= GET LOCALISATION PUBLIC (visiteurs) =================
async getLocalisationPublic() {
  const hotels = await this.hotelRepository.find({
    select: ['idhotel', 'nom', 'latitude', 'longitude'],
  });

  return hotels.map(h => ({
    id: h.idhotel,
    nom: h.nom,
    latitude: h.latitude,
    longitude: h.longitude,
  }));
}



  async findOneByUser(id: number, userId: number, role: string): Promise<Hotel> {

    const hotel = await this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['admin', 'chambres', 'hotelManager'],
    });

    if (!hotel) throw new NotFoundException('Hotel non trouve');

    if (role === 'hotel-manager' && hotel.hotelManager?.iduser !== userId) {
      throw new ForbiddenException('Acces refuse');
    }

    return hotel;
  }

  async update(id: number, dto: UpdateHotelDto): Promise<Hotel> {

    await this.hotelRepository.update(id, dto);

    const updated = await this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['admin', 'chambres', 'hotelManager'],
    });

    if (!updated) throw new NotFoundException('Hotel non trouve');

    return updated;
  }

  async remove(id: number) {
    return this.hotelRepository.delete(id);
  }

  

}