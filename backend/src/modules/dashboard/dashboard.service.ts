import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Executa as contagens em paralelo para performance
    const [users, products, categories, recentProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true } // Para saber QUEM criou
      }),
    ]);

    // Formata o rastro de auditoria conforme o PDF
    const recentActivities = recentProducts.map(p => ({
      userName: p.user?.name || 'Sistema',
      action: `CADASTROU O ATIVO: ${p.name}`,
      date: p.createdAt
    }));

    return {
      users,
      products,
      categories,
      recentActivities
    };
  }
}