import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getNetworkKPIs() {
    const totalTrains = await this.prisma.train.count();
    const onTimeTrains = await this.prisma.train.count({ where: { status: 'ON_TIME' } });
    const delayedTrains = await this.prisma.train.count({ where: { status: 'DELAYED' } });
    const activeAlerts = await this.prisma.alert.count({ where: { status: 'ACTIVE' } });
    
    return {
      totalTrains,
      onTimeTrains,
      delayedTrains,
      punctualityRate: totalTrains > 0 ? (onTimeTrains / totalTrains) * 100 : 0,
      activeAlerts,
    };
  }

  async getDelayDistribution(fromDate: Date, toDate: Date) {
    return {
      "< 15m": 45,
      "15m - 30m": 25,
      "30m - 1h": 15,
      "1h - 2h": 10,
      "> 2h": 5
    };
  }

  async getThroughput(period: string) {
    return [
      { timestamp: new Date(), count: 120 },
      { timestamp: new Date(Date.now() - 3600000), count: 110 }
    ];
  }

  async getStationPerformance(stationCode: string) {
    return {
      code: stationCode,
      trainsHandled: 250,
      averageDelay: 12,
      platformUtilization: 78
    };
  }

  async getZoneComparison() {
    return [
      { zone: "NR", onTime: 85, delayed: 15 },
      { zone: "SR", onTime: 92, delayed: 8 },
      { zone: "WR", onTime: 88, delayed: 12 }
    ];
  }

  async getDelayHeatmap() {
    return [
      { lat: 28.6428, lon: 77.2197, intensity: 0.8 },
      { lat: 18.9398, lon: 72.8355, intensity: 0.5 }
    ];
  }

  async getExecutiveKPIs() {
    return {
      nationalPunctuality: 88.5,
      totalActiveAlerts: 142,
      criticalAssets: 3,
      overallNetworkHealth: 'Good'
    };
  }

  async getExecutiveZones() {
    return [
      { zone: 'NR', performance: 85 },
      { zone: 'CR', performance: 82 },
      { zone: 'SR', performance: 91 },
      { zone: 'WR', performance: 88 },
      { zone: 'ER', performance: 86 }
    ];
  }

  async getExecutiveDelayTrend() {
    return {
      trend: 'improving',
      data: [
        { date: '2024-01', avgDelay: 25 },
        { date: '2024-02', avgDelay: 22 },
        { date: '2024-03', avgDelay: 18 }
      ]
    };
  }

  async getExecutiveMonthly() {
    return {
      currentMonth: { punctuality: 89, alerts: 450 },
      previousMonth: { punctuality: 87, alerts: 520 }
    };
  }

  async getExecutiveTopDelayedRoutes() {
    return [
      { route: 'NDLS - HWH', avgDelay: 45 },
      { route: 'CSMT - NDLS', avgDelay: 38 },
      { route: 'MAS - NDLS', avgDelay: 35 },
      { route: 'SBC - NDLS', avgDelay: 30 },
      { route: 'ADI - NDLS', avgDelay: 28 }
    ];
  }

  async getExecutiveAIRecommendations() {
    return [
      { type: 'SCHEDULE', message: 'Optimize NR zone morning departures to reduce cascading delays', priority: 'HIGH', actions: ['Review timetable'] },
      { type: 'MAINTENANCE', message: 'Preemptive maintenance required on CSMT-PUNE track switches', priority: 'CRITICAL', actions: ['Schedule maintenance'] },
      { type: 'ROUTING', message: 'Divert freight traffic on Eastern Corridor to improve passenger punctuality', priority: 'MEDIUM', actions: ['Analyze freight routes'] },
      { type: 'CREW', message: 'Reallocate spare crew from SR to WR for upcoming festive season', priority: 'MEDIUM', actions: ['Update roster'] },
      { type: 'ASSET', message: 'Upgrade signaling system at New Delhi junction to handle increased traffic', priority: 'HIGH', actions: ['Initiate procurement'] }
    ];
  }
}
