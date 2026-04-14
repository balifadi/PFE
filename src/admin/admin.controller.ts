import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admins')
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {

  constructor(private readonly adminService: AdminService) {}

  // ✅ DASHBOARD
  @Get('dashboard')
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Admin dashboard stats' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ✅ GET ALL ADMINS
  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Get all admins' })
  findAll(@Request() req: any) {
    return this.adminService.findAll(req.user);
  }
}