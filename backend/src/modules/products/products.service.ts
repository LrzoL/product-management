import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // LISTAGEM COMPLETA (Resolvendo o erro de Method Not Implemented)
  async findAll(params: { page: number; search: string }) {
    const { page, search } = params;
    const take = 10;
    const skip = (page - 1) * take;

    const where = search ? { 
      name: { contains: search, mode: 'insensitive' as const } 
    } : {};

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { 
          categories: {
            include: { category: true }
          },
          user: { select: { name: true } } 
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page };
  }

  // CRIAÇÃO: Usuário comum e Admin podem criar
  async create(userId: string, dto: CreateProductDto, file: Express.Multer.File) {
    const imageUrl = file ? `uploads/${file.filename}` : null;
    
    const product = await this.prisma.product.create({
      data: {
        name: dto.name.toUpperCase(),
        description: dto.description,
        userId: userId,
        imageUrl: imageUrl,
        categories: {
          create: {
            categoryId: dto.categoryId
          }
        }
      },
      include: {
        categories: { include: { category: true } }
      }
    });

    // Auditoria Obrigatória
    await this.prisma.auditLog.create({
      data: {
        action: 'CRIAÇÃO',
        entity: 'PRODUTO',
        entityId: product.id,
        userId: userId,
        details: `CADASTROU O ATIVO: ${product.name}`,
      }
    });

    return product;
  }

  // REMOÇÃO: Apenas ADMIN
  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem excluir ativos.');
    }

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    await this.prisma.product.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        action: 'EXCLUSÃO',
        entity: 'PRODUTO',
        entityId: id,
        userId: userId,
        details: `ADMIN REMOVEU O ATIVO: ${product.name}`,
      }
    });
  }
}