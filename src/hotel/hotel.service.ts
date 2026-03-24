import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';
import { NotificationService } from '../notification/notification.service';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private notificationService: NotificationService,
  ) {}

  async create(hotel: Partial<Hotel>, clientId: number): Promise<Hotel> {
    const admin = await this.adminRepository.findOne({
      where: { iduser: (hotel as any).adminId },
    });

    const newHotel = this.hotelRepository.create({
      ...hotel,
      admin: admin!,
    });

    const savedHotel = await this.hotelRepository.save(newHotel);

    await this.notificationService.envoyerNotificationClient(
      clientId,
      "Nouvel hôtel ajouté : " + savedHotel.nom,
      "hotel"
    );

    return savedHotel;
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find({ relations: ['admin', 'chambres'] });
  }

  async findOne(id: number): Promise<Hotel | null> {
    return this.hotelRepository.findOne({
      where: { idhotel: id },
      relations: ['admin', 'chambres'],
    });
  }

  async update(id: number, data: Partial<Hotel>) {
    return this.hotelRepository.update(id, data);
  }

  async remove(id: number) {
    return this.hotelRepository.delete(id);
  }
}