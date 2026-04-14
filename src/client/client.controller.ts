import {
  Controller, Get, UseGuards, Request
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientController {

  constructor(private readonly clientService: ClientService) {}

  // ===============================
  // ✅ ADMIN → GET ALL CLIENTS
  // ===============================
  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Get all clients (admin only)' })
  findAll(@Request() req: any) {
    return this.clientService.findAll(req.user);
  }

  // ===============================
  // ✅ CLIENT ACCOUNT (via JWT)
  // ===============================

  @Get('profile')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Profil du client connecté (via token JWT)' 
  })
  getProfile(@Request() req: any) {
    return this.clientService.getProfile(req.user.iduser);
  }

  @Get('reservations')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Réservations du client connecté' 
  })
  getReservations(@Request() req: any) {
    return this.clientService.getReservations(req.user.iduser);
  }

  @Get('locations')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Locations du client connecté' 
  })
  getLocations(@Request() req: any) {
    return this.clientService.getLocations(req.user.iduser);
  }

  @Get('favoris')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Favoris du client connecté' 
  })
  getFavoris(@Request() req: any) {
    return this.clientService.getFavoris(req.user.iduser);
  }

  @Get('notifications')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Notifications du client connecté' 
  })
  getNotifications(@Request() req: any) {
    return this.clientService.getNotifications(req.user.iduser);
  }

  @Get('avis')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Avis du client connecté' 
  })
  getAvis(@Request() req: any) {
    return this.clientService.getAvis(req.user.iduser);
  }

  @Get('factures')
  @Roles('client')
  @ApiResponse({ 
    status: 200, 
    description: 'Factures du client connecté' 
  })
  getFactures(@Request() req: any) {
    return this.clientService.getFactures(req.user.iduser);
  }
}