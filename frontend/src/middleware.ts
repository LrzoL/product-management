import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Supomos que você salva o cargo no cookie após o login
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Se o usuário tentar entrar na dashboard e não for ADMIN
  if (pathname.startsWith('/dashboard') && role !== 'ADMIN') {
    // Redireciona para produtos (página padrão do usuário comum)
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*'], // Rotas protegidas
};