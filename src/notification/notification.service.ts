import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { Client } from '../entities/client.entity';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // envoyer notification au client
  async envoyerNotificationClient(
    clientId: number,
    message: string,
    type: string,
  ): Promise<Notification> {

    const notification = new Notification();
    notification.message = message;
    notification.type = type;
    notification.date_Envoi = new Date();

    notification.client = { iduser: clientId } as Client;

    return this.notificationRepository.save(notification);
  }

  // envoyer notification à l'admin
  async envoyerNotificationAdmin(
    adminId: number,
    message: string,
    type: string,
  ): Promise<Notification> {

    const notification = new Notification();
    notification.message = message;
    notification.type = type;
    notification.date_Envoi = new Date();

    notification.admin = { iduser: adminId } as Admin;

    return this.notificationRepository.save(notification);
  }

  // afficher toutes les notifications
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: ['client', 'admin'],
      order: { date_Envoi: 'DESC' }
    });
  }

  // afficher notification par id
  async findOne(id: number): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: { idnotification: id },
      relations: ['client', 'admin'],
    });
  }

  // supprimer notification
  async remove(id: number) {
    return this.notificationRepository.delete(id);
  }
}