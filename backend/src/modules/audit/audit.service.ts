import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, role: Role) {
    // Se for ADMIN, busca todos os logs do sistema
    if (role === Role.ADMIN) {
      return this.prisma.auditLog.findMany({
        include: {
          user: { select: { name: true, email: true } }
        },
        orderBy: { timestamp: 'desc' }
      });
    }

    // Se for USER comum, busca apenas os logs onde o userId é o dele
    return this.prisma.auditLog.findMany({
      where: { userId },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { timestamp: 'desc' }
    });
  }
}