import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client'; // Importante para tipar o Role

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ 
      where: { email: dto.email } 
    });
    
    if (exists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: { 
        ...dto, 
        password: hashedPassword 
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true,
        createdAt: true 
      }
    });
  }

  // NOVA FUNÇÃO: Alternar entre ADMIN e USER
  async toggleRole(id: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Lógica de inversão
    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: { id: true, name: true, role: true }
    });

    // REGISTRO DE AUDITORIA (Exigência do PDF)
    await this.prisma.auditLog.create({
      data: {
        action: 'ALTERAR_PERMISSAO',
        entity: 'USUÁRIO',
        entityId: id,
        userId: adminId, // O ID do administrador que está realizando a ação
        details: `ALTEROU O PAPEL DE ${user.name.toUpperCase()} PARA ${newRole}`,
      }
    });

    return updatedUser;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: { select: { products: true } }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}