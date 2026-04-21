'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ClipboardList, 
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Produtos', icon: Package, path: '/dashboard/products' },
    { name: 'Categorias', icon: Tags, path: '/dashboard/categories' },
    { name: 'Usuários', icon: Users, path: '/dashboard/users', adminOnly: true },
    { name: 'Auditoria', icon: ClipboardList, path: '/dashboard/audit', adminOnly: true },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="bg-[#004795] p-1 rounded-sm">
          <span className="text-white font-black text-sm uppercase">Gov<span className="text-[#ffcc00]">PE</span></span>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SISTEMA UNIFICADO</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all ${
                isActive 
                ? 'bg-blue-50 text-[#004795] border-l-4 border-[#004795]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#004795]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-red-500 uppercase tracking-wider hover:bg-red-50 transition-all rounded-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}