import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  toggleFavorite(userId: string, productId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProductDto, file?: Express.Multer.File) {
    const { categoryIds, ...data } = dto;

    return this.prisma.product.create({
      data: {
        ...data,
        userId,
        imageUrl: file ? file.path : null,
        categories: {
          create: categoryIds?.map(id => ({
            category: { connect: { id } }
          }))
        }
      },
      include: { categories: { include: { category: true } } }
    });
  }

// Localize o método findAll e deixe-o EXATAMENTE assim:
async findAll(query: { search?: string; page?: number }) {
  const { page = 1, search } = query;
  const take = 10;
  const skip = (page - 1) * take;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, total] = await this.prisma.$transaction([
    this.prisma.product.findMany({
      where,
      take,
      skip,
      include: {
        categories: { include: { category: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / take),
    },
  };
}

  async update(id: string, userId: string, dto: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.userId !== userId)
      throw new ForbiddenException('Acesso negado');

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.update(id, userId, {}); // Reaproveita a lógica de verificação
    return this.prisma.product.delete({ where: { id } });
  }
}