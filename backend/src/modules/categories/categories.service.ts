import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Caminho relativo para evitar erro de módulo
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova categoria vinculada ao usuário logado.
   */
  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        userId: userId,
      },
    });
  }

  /**
   * Retorna todas as categorias.
   * Adicionado: Contagem de produtos vinculados (útil para o front-end).
   */
  async findAll(userId: string) {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca uma categoria por ID.
   * Valida se a categoria existe.
   */
  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } }
      }
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada.`);
    }

    return category;
  }

  /**
   * Atualiza uma categoria.
   * Regra de Segurança: Apenas o dono da categoria (ou um ADMIN) pode editar.
   */
  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id, userId);

    // Validação de propriedade (Segurança)
    if (category.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar esta categoria.',
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Remove uma categoria.
   * Regra de Negócio: Impede remoção se houver produtos vinculados.
   */
  async remove(id: string, userId: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada.`);
    }

    // Validação de propriedade
    if (category.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta categoria.',
      );
    }

    // Validação de Integridade (Relacionamento N:N)
    if (category.products.length > 0) {
      throw new ConflictException(
        'Não é possível excluir uma categoria que possui produtos vinculados.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
};