'use client';

import { Bell, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Espaço para breadcrumbs ou busca rápida */}
      </div>

      <div className="flex items-center gap-6">
        {/* Notificações - Requisito de Mensageria */}
        <button className="relative p-2 text-gray-400 hover:text-[#004795] transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {/* Perfil Compacto */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-800 uppercase leading-none">Usuário Logado</p>
            <p className="text-[9px] font-bold text-[#004795] uppercase">Perfil: Admin</p>
          </div>
          <UserCircle className="w-8 h-8 text-gray-300" />
        </div>
      </div>
    </header>
  );
}