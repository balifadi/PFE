import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  Request,
  UseGuards
} from '@nestjs/common';

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  // ===== CREATE =====
  @Post()
  @Roles('admin', 'hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Créer une notification' })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() dto: CreateNotificationDto, @Request() req: any) {
    const role: string = req.user.role;

    if (role === 'admin') {
      return this.notificationService.create({
        ...dto,
        senderId: req.user.iduser,
        senderRole: role,
      });
    }

    if (role === 'hotel-manager') {
      return this.notificationService.create({
        ...dto,
        senderId: req.user.iduser,
        senderRole: role,
        message: 'Votre réservation est confirmée : ' + dto.message,
      });
    }

    if (role === 'agence-manager') {
      return this.notificationService.create({
        ...dto,
        senderId: req.user.iduser,
        senderRole: role,
        message: 'Votre location est confirmée : ' + dto.message,
      });
    }

    throw new Error('Accès refusé');
  }

  // ===== FIND ALL =====
  @Get()
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Lister toutes les notifications selon le rôle' })
  findAll(@Request() req: any) {
    return this.notificationService.findAll(req.user.iduser, req.user.role);
  }

  // ===== CLIENT SPECIFIC =====
  @Get('me')
  @Roles('client')
  @ApiOperation({ summary: 'Lister les notifications du client connecté' })
  getMyNotifications(@Request() req: any) {
    return this.notificationService.getByClient(req.user.iduser);
  }

  // ===== FIND ONE =====
  @Get(':id')
  @Roles('admin', 'client', 'hotel-manager', 'agence-manager')
  @ApiOperation({ summary: 'Afficher une notification par ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.notificationService.findOne(id, req.user.iduser, req.user.role);
  }

  // ===== MARK AS READ =====
  @Patch(':id/read')
  @Roles('client')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiParam({ name: 'id', example: 1 })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  // ===== DELETE =====
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }
}