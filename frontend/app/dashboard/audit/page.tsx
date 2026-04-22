'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../../src/components/Sidebar';
import api from '../../../src/services/api';
import { History, User, Calendar, Activity } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/audit').then(res => setLogs(res.data)).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa] text-black">
      
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Auditoria</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rastreabilidade de Ações (Quem, O quê, Quando)</p>
        </header>

        <div className="bg-white shadow-sm border border-gray-100 rounded-sm divide-y divide-gray-50">
          {logs.length > 0 ? logs.map((log: any) => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-full"><User className="w-4 h-4 text-[#004795]" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-800 uppercase">{log.action}</p>
                  <p className="text-[10px] text-gray-400 font-medium">REALIZADO POR: <span className="text-[#004795]">{log.user.name}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase">
                <div className="flex items-center gap-1"><Activity className="w-3 h-3" /> {log.entity}</div>
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}</div>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Aguardando novas ações para gerar logs...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}