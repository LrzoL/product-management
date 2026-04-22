'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { role } = JSON.parse(storedUser);
        setUserRole(role);
      } catch (e) {
        console.error("Erro ao ler usuário");
      }
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', adminOnly: true },
    { name: 'Produtos', icon: Package, path: '/dashboard/products' },
    { name: 'Categorias', icon: Tags, path: '/dashboard/categories' },
    { name: 'Usuários', icon: Users, path: '/dashboard/users', adminOnly: true },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    /* Ajustado: w-20 fixa (compacta) e md:w-64 (expandida) com min-w-fit para não esmagar */
    <aside className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 transition-all duration-300">
      
      {/* Header da Sidebar: Esconde o texto longo no mobile/compacto */}
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row items-center gap-2 overflow-hidden">
        <div className="bg-[#004795] p-1.5 rounded-sm shrink-0">
          <span className="text-white font-black text-xs md:text-sm uppercase leading-none">
            Gov<span className="text-[#ffcc00]">PE</span>
          </span>
        </div>
        <span className="hidden md:block text-[9px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">
          SISTEMA UNIFICADO
        </span>
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && userRole !== 'ADMIN') return null;

          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={item.name} /* Tooltip quando estiver compacto */
              className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all group ${
                isActive 
                ? 'bg-blue-50 text-[#004795] border-l-4 border-[#004795]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#004795]'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#004795]' : 'text-gray-400 group-hover:text-[#004795]'}`} />
              {/* Esconde o texto no modo compacto (w-20) */}
              <span className="hidden md:block whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title="Sair"
          className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 text-[11px] font-bold text-red-500 uppercase tracking-wider hover:bg-red-50 transition-all rounded-md group"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block whitespace-nowrap">
            Sair do Sistema
          </span>
        </button>
      </div>
    </aside>
  );
}