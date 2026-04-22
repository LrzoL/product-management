import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se você passou 'id' no decorator @GetUser('id'), 
    // ele tenta retornar user['id']. Verifique se o seu token tem 'id' ou 'sub'.
    return data ? user?.[data] : user;
  },
);
