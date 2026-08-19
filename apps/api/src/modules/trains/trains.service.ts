import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.train.findMany({
      include: {
        currentPlatform: true,
        nextPlatform: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.train.findUnique({
      where: { id },
    });
  }

  async findByNumber(trainNumber: string) {
    return this.prisma.train.findUnique({
      where: { trainNumber },
    });
  }
}
