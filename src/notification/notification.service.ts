import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Admin } from '../entities/admin.entity';
import { Client } from '../entities/client.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateNotificationDto & { senderId?: number; senderRole?: string },
  ): Promise<Notification> {

    let admin: Admin | null = null;
    let client: Client | null = null;

    // sender
    if (
      dto.senderRole === 'admin' ||
      dto.senderRole === 'hotel-manager' ||
      dto.senderRole === 'agence-manager'
    ) {
      if (dto.senderId) {
        admin = await this.adminRepository.findOneBy({ iduser: dto.senderId });
      }
    }

    // receiver
    if (dto.clientId) {
      client = await this.clientRepository.findOneBy({ iduser: dto.clientId });
      if (!client) throw new NotFoundException('Client non trouvé');
    }

    const notification = this.notificationRepository.create({
      type: dto.type,
      message: dto.message,
      date_Envoi: new Date(),
      isRead: false, // ✅ جديد
      admin: admin ?? undefined,
      client: client ?? undefined,
    });

    const saved = await this.notificationRepository.save(notification);

    this.eventEmitter.emit('notification.new', saved);

    return saved;
  }

  // 🔥 تحسين: كل حسب role
  async findAll(userId: number, role: string): Promise<Notification[]> {

    if (role === 'admin') {
      return this.notificationRepository.find({
        relations: ['client', 'admin'],
        order: { date_Envoi: 'DESC' },
      });
    }

    if (role === 'client') {
      return this.getByClient(userId); // ✅ استعملنا function جديدة
    }

    if (role === 'hotel-manager') {
      return this.notificationRepository.find({
        where: { type: 'reservation' },
        relations: ['client', 'admin'],
        order: { date_Envoi: 'DESC' },
      });
    }

    if (role === 'agence-manager') {
      return this.notificationRepository.find({
        where: { type: 'location' },
        relations: ['client', 'admin'],
        order: { date_Envoi: 'DESC' },
      });
    }

    return [];
  }

  
  async getByClient(clientId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { client: { iduser: clientId } },
      relations: ['client', 'admin'],
      order: { date_Envoi: 'DESC' },
    });
  }

  async findOne(id: number, userId: number, role: string): Promise<Notification> {

    const notification = await this.notificationRepository.findOne({
      where: { idnotification: id },
      relations: ['client', 'admin'],
    });

    if (!notification) throw new NotFoundException('Notification non trouvée');

    if (role === 'client' && notification.client?.iduser !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    if (role === 'hotel-manager' && notification.type !== 'reservation') {
      throw new ForbiddenException('Accès refusé');
    }

    if (role === 'agence-manager' && notification.type !== 'location') {
      throw new ForbiddenException('Accès refusé');
    }

    return notification;
  }

  // ✅ جديد: mark as read
  async markAsRead(id: number): Promise<Notification> {

    const notification = await this.notificationRepository.findOneBy({
      idnotification: id,
    });

    if (!notification) throw new NotFoundException('Notification non trouvée');

    notification.isRead = true;

    return this.notificationRepository.save(notification);
  }

  async remove(id: number): Promise<void> {

    const notification = await this.notificationRepository.findOneBy({
      idnotification: id,
    });

    if (!notification) throw new NotFoundException('Notification non trouvée');

    await this.notificationRepository.delete(id);
  }
}