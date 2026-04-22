'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/services/api';
import { Users, Package, Tags, History, ShieldCheck, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, products: 0, categories: 0, recentActivities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return router.push('/login');
    
    const { role } = JSON.parse(storedUser);
    
    if (role !== 'ADMIN') {
      router.replace('/products');
      return;
    }

    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Erro na auditoria");
    } finally {
      setLoading(false);
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();
    doc.setFillColor(0, 71, 149);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('GOVERNO DE PERNAMBUCO', 14, 20);

    doc.setFontSize(9);
    doc.text(`RELATÓRIO DE AUDITORIA - GERADO EM: ${now}`, 14, 30);
    
    autoTable(doc, {
      startY: 50,
      head: [['RESPONSÁVEL', 'AÇÃO REALIZADA', 'DATA E HORA']],
      body: stats.recentActivities.map((a: any) => [
        a.userName.toUpperCase(), 
        a.action, 
        new Date(a.date).toLocaleString() 
      ]),
      headStyles: { fillColor: [0, 71, 149] },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.save(`auditoria_${new Date().getTime()}.pdf`);
  };

  if (loading) return <div className="p-10 font-black text-[10px] uppercase">Validando Acesso...</div>;

  return (
    <div className="p-4 space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Dashboard de Auditoria</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Painel Administrativo GovPE</p>
        </div>
        <button onClick={exportToPDF} className="bg-[#004795] hover:bg-[#003570] text-white px-6 py-3 text-[10px] font-black uppercase transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </header>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 border-l-4 border-l-[#004795] border border-gray-100 shadow-sm rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total de Produtos</p>
              <h3 className="text-3xl font-black text-gray-800">{stats.products}</h3>
            </div>
            <Package className="w-8 h-8 text-[#004795] opacity-20" />
          </div>
        </div>

       
        <div className="bg-white p-6 border-l-4 border-l-amber-500 border border-gray-100 shadow-sm rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Usuários Ativos</p>
              <h3 className="text-3xl font-black text-gray-800">{stats.users}</h3>
            </div>
            <Users className="w-8 h-8 text-amber-500 opacity-20" />
          </div>
        </div>

       
        <div className="bg-white p-6 border-l-4 border-l-emerald-500 border border-gray-100 shadow-sm rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Categorias</p>
              <h3 className="text-3xl font-black text-gray-800">{stats.categories}</h3>
            </div>
            <Tags className="w-8 h-8 text-emerald-500 opacity-20" />
          </div>
        </div>
      </div>

      <section className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center gap-2 font-black text-[11px] uppercase tracking-widest text-gray-600">
          <History className="w-4 h-4 text-[#004795]" />
          Rastro de Auditoria (Logs Recentes)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[9px] uppercase font-black text-gray-400">
              <tr>
                <th className="px-6 py-3">Operador</th>
                <th className="px-6 py-3">Ação Realizada</th>
                <th className="px-6 py-3">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity: any, i: number) => (
                  <tr key={i} className="text-[11px] hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700 uppercase">{activity.userName}</td>
                    <td className="px-6 py-4 text-gray-600 italic">"{activity.action}"</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {new Date(activity.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400 uppercase text-[10px] font-bold">
                    Nenhuma atividade registrada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}