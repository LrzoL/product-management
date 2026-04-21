import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body, params } = request;

    return next.handle().pipe(
      tap(async () => {
        // Ignora GETs e ações de usuários não autenticados
        if (method !== 'GET' && user) {
          const entity = url.split('/')[3] || 'unknown'; // Pega o recurso após v1/
          
          await this.prisma.auditLog.create({
            data: {
              action: method,
              entity: entity,
              entityId: params.id || body.id || 'N/A',
              userId: user.id,
              details: `O usuário ${user.email} realizou ${method} no recurso ${entity}`,
            },
          }).catch(err => console.error('Falha ao gravar Auditoria:', err));
        }
      }),
    );
  }
}