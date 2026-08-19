import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpi')
  @ApiOperation({ summary: 'Get network KPIs' })
  getNetworkKPIs() {
    return this.analyticsService.getNetworkKPIs();
  }

  @Get('delays')
  @ApiOperation({ summary: 'Get delay distribution' })
  getDelayDistribution() {
    return this.analyticsService.getDelayDistribution(new Date(), new Date());
  }

  @Get('executive/kpis')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'National KPI overview' })
  getExecutiveKPIs() {
    return this.analyticsService.getExecutiveKPIs();
  }

  @Get('executive/zones')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Zone performance comparison' })
  getExecutiveZones() {
    return this.analyticsService.getExecutiveZones();
  }

  @Get('executive/delay-trend')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '90-day delay trend' })
  getExecutiveDelayTrend() {
    return this.analyticsService.getExecutiveDelayTrend();
  }

  @Get('executive/monthly')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '6-month comparison' })
  getExecutiveMonthly() {
    return this.analyticsService.getExecutiveMonthly();
  }

  @Get('executive/top-delayed-routes')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Top 5 most delayed routes' })
  getExecutiveTopDelayedRoutes() {
    return this.analyticsService.getExecutiveTopDelayedRoutes();
  }

  @Get('executive/ai-recommendations')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '5 AI-generated strategic recommendations' })
  getExecutiveAIRecommendations() {
    return this.analyticsService.getExecutiveAIRecommendations();
  }
}
