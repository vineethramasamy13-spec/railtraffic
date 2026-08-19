import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.station.findMany({
      include: {
        platforms: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.station.findUnique({
      where: { id },
      include: {
        platforms: true,
      }
    });
  }

  async findByCode(code: string) {
    return this.prisma.station.findUnique({
      where: { code },
      include: {
        platforms: true,
      }
    });
  }
}
