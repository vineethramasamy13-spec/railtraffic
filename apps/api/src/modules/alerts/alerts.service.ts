import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findActive() {
    return this.prisma.alert.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
  }
}
