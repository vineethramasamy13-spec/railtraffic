import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async getAssetRiskDashboard() {
    return this.prisma.maintenanceAsset.findMany({
      orderBy: { riskScore: 'desc' }
    });
  }

  async getTrackHealthPredictions() {
    return this.prisma.maintenanceAsset.findMany({
      where: { assetType: 'TRACK' },
      orderBy: { riskScore: 'desc' },
      take: 10
    });
  }

  async getSignalFailurePredictions() {
    return this.prisma.maintenanceAsset.findMany({
      where: { assetType: 'SIGNAL' },
      orderBy: { riskScore: 'desc' },
      take: 10
    });
  }

  async getSwitchFailurePredictions() {
    return this.prisma.maintenanceAsset.findMany({
      where: { assetType: 'SWITCH' },
      orderBy: { riskScore: 'desc' },
      take: 10
    });
  }

  async getMaintenanceSchedule(fromDate: Date, toDate: Date) {
    return this.prisma.maintenanceAsset.findMany({
      where: {
        nextMaintenance: {
          gte: fromDate,
          lte: toDate
        }
      },
      orderBy: { nextMaintenance: 'asc' }
    });
  }

  async createMaintenanceAlert(dto: any) {
    return this.prisma.alert.create({
      data: {
        title: `Maintenance required for ${dto.assetCode}`,
        description: dto.description || `High risk detected.`,
        severity: 'WARNING',
        category: 'MAINTENANCE',
        status: 'ACTIVE',
        aiRootCause: 'AI detection based on age and health score',
        recommendedAction: 'Schedule immediate inspection',
      }
    });
  }
}
