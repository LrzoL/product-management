import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  update(id: string, userId: string, dto: UpdateCategoryDto) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  // 1. Criar Categoria (Auditoria)
  async create(userId: string, dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name.toUpperCase(),
        userId: userId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'CRIAÇÃO',
        entity: 'CATEGORIA',
        entityId: category.id,
        userId: userId,
        details: `CADASTROU A CATEGORIA: ${category.name}`,
      }
    });

    return category;
  }

  // 2. Listar TODAS as Categorias (Exigência: Listagem para todos os autenticados)
  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        user: { select: { name: true } }
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoria não encontrada.');
    return category;
  }

  // 5. Remover Categoria (REGRA DO PDF: Área exclusiva de ADMIN para gerenciar a aplicação)
  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // Trava de Perfil: Somente Admin apaga categorias no sistema
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem excluir categorias.');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });

    if (!category) throw new NotFoundException('Categoria não encontrada.');

    // Regra de Integridade: Não apaga se houver produto vinculado
    if (category.products.length > 0) {
      throw new ConflictException('Existem produtos vinculados a esta categoria.');
    }

    await this.prisma.category.delete({ where: { id } });

    // Registro de Auditoria (Quem, O que, Quando)
    await this.prisma.auditLog.create({
      data: {
        action: 'EXCLUSÃO',
        entity: 'CATEGORIA',
        entityId: id,
        userId: userId,
        details: `ADMIN REMOVEU A CATEGORIA: ${category.name}`,
      }
    });
  }
}