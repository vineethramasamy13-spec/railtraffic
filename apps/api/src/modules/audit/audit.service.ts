import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(data: {
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
  }) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
        changes: data.changes ? JSON.stringify(data.changes) : null,
      }
    });
  }
}
