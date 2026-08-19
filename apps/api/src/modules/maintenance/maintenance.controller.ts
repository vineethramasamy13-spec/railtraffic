import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('maintenance')
@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER, Role.OPERATOR)
  @ApiOperation({ summary: 'Get asset risk dashboard' })
  getAssetRiskDashboard() {
    return this.maintenanceService.getAssetRiskDashboard();
  }

  @Get('predictions/track')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER)
  @ApiOperation({ summary: 'Get track health predictions' })
  getTrackHealthPredictions() {
    return this.maintenanceService.getTrackHealthPredictions();
  }

  @Get('predictions/signal')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER)
  @ApiOperation({ summary: 'Get signal failure predictions' })
  getSignalFailurePredictions() {
    return this.maintenanceService.getSignalFailurePredictions();
  }

  @Get('predictions/switch')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER)
  @ApiOperation({ summary: 'Get switch failure predictions' })
  getSwitchFailurePredictions() {
    return this.maintenanceService.getSwitchFailurePredictions();
  }

  @Get('schedule')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER, Role.OPERATOR)
  @ApiOperation({ summary: 'Get maintenance schedule' })
  getMaintenanceSchedule(@Query('from') from: string, @Query('to') to: string) {
    return this.maintenanceService.getMaintenanceSchedule(new Date(from || Date.now()), new Date(to || Date.now() + 30 * 86400000));
  }

  @Post('alert')
  @Roles(Role.ADMIN, Role.ZONE_MANAGER)
  @ApiOperation({ summary: 'Create maintenance alert' })
  createMaintenanceAlert(@Body() dto: any) {
    return this.maintenanceService.createMaintenanceAlert(dto);
  }
}
