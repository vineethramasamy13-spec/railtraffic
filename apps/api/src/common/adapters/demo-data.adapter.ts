import { Injectable } from '@nestjs/common';
import { ITrainDataProvider, TrainFilters, TrainPosition } from './train-data-provider.interface';
import { PrismaService } from '../../database/prisma.service';

/**
 * DemoDataAdapter - historical replay datasets
 * Connect NTESAdapter or CRISAdapter with Ministry API credentials in production.
 */
@Injectable()
export class DemoDataAdapter implements ITrainDataProvider {
  private subscribers: ((train: any) => void)[] = [];

  constructor(private prisma: PrismaService) {
    // Demo provider adapter loop
    setInterval(() => {
      this.notifySubscribers();
    }, 5000);
  }

  async getTrains(filters?: TrainFilters): Promise<any[]> {
    const where: any = {};
    if (filters?.zone) where.zone = filters.zone;
    if (filters?.status) where.status = filters.status;

    return this.prisma.train.findMany({ where });
  }

  async getTrainById(id: string): Promise<any | null> {
    return this.prisma.train.findUnique({ where: { id } });
  }

  async getTrainPosition(trainId: string): Promise<TrainPosition | null> {
    return {
      lat: 20 + Math.random() * 10,
      lon: 70 + Math.random() * 15,
      speed: Math.floor(Math.random() * 120),
      timestamp: new Date()
    };
  }

  subscribeToUpdates(callback: (train: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private async notifySubscribers() {
    const trains = await this.getTrains();
    if (trains.length > 0) {
      const train = trains[Math.floor(Math.random() * trains.length)];
      this.subscribers.forEach(cb => cb(train));
    }
  }
}
