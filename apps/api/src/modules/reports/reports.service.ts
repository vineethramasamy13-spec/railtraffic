import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(type: string, userId: string) {
    return this.prisma.report.create({
      data: {
        title: `${type} Report`,
        type,
        generatedBy: userId,
        status: 'PENDING',
        aiSummary: 'Report is being generated',
      }
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}
