'use client';

import Sidebar from '../../src/components/Sidebar';
import { Package, Tags, Users, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  // Mock de dados (em breve buscaremos da API)
  const stats = [
    { label: 'Produtos Ativos', value: '128', icon: Package, color: 'bg-blue-500' },
    { label: 'Categorias', value: '12', icon: Tags, color: 'bg-emerald-500' },
    { label: 'Usuários Sistema', value: '45', icon: Users, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa] text-black">
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Dashboard</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Visão Geral da Plataforma</p>
        </header>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 shadow-sm border-b-4 border-[#004795] rounded-sm flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-full bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Área de Atividade Recente (Requisito de Auditoria) */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Últimas Ações de Auditoria</h3>
            <button className="text-[9px] font-bold text-[#004795] uppercase hover:underline">Ver relatório completo</button>
          </div>
          <div className="p-0">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#004795]">
                    JD
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase">Produto "Servidor Dell" Editado</p>
                    <p className="text-[9px] text-gray-400 font-medium">Por: João Duarte • Há 12 minutos</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}