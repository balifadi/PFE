import { Controller, Get, Delete, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  // afficher toutes les notifications
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  // afficher notification par id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notificationService.findOne(id);
  }

  // supprimer notification
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.notificationService.remove(id);
  }
}