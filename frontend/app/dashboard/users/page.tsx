'use client';

import { useEffect, useState } from 'react';
import api from '../../../src/services/api';
import { Mail, ShieldCheck, UserCog, Loader2, Users } from 'lucide-react';

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user'); 
    
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        loadUsers();
      } catch (e) {
        console.error("Erro ao analisar usuário");
      }
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRole(id: string, currentRole: string) {
    if (currentUser?.role !== 'ADMIN') return;

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`CONFIRMA A ALTERAÇÃO PARA ${newRole}?`)) return;

    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      await loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao atualizar permissão");
    }
  }

 
  const filteredUsers = users.filter((user: any) => {
    
    if (currentUser?.role === 'ADMIN') return true;

    return user.id === currentUser?.id || user.role === 'ADMIN';
  });

  if (loading) return (
    <div className="flex h-full items-center justify-center p-20">
      <Loader2 className="w-6 h-6 animate-spin text-[#004795]" />
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Gestão de Usuários</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Quadro de Permissões e Hierarquia
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user: any) => (
          <div 
            key={user.id} 
            className={`bg-white p-6 border shadow-sm rounded-sm flex flex-col justify-between transition-all ${
              user.id === currentUser?.id ? 'border-[#004795] ring-1 ring-[#004795]/10' : 'border-gray-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                  user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
                {user.role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-amber-500" />}
              </div>
              
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-tighter">
                {user.name} 
                {user.id === currentUser?.id && (
                  <span className="ml-2 text-[8px] text-[#004795] bg-blue-50 px-1.5 py-0.5 rounded">VOCÊ</span>
                )}
              </h3>
              
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">
                <Mail className="w-3 h-3" /> 
                <span className="truncate">{user.email}</span>
              </div>
            </div>

          
            {currentUser?.role === 'ADMIN' && user.id !== currentUser?.id && (
              <div className="mt-6 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleToggleRole(user.id, user.role)}
                  className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-[#004795] uppercase border border-[#004795] py-2.5 hover:bg-[#004795] hover:text-white transition-all shadow-md"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  {user.role === 'ADMIN' ? 'REMOVER ADMIN' : 'TORNAR ADMIN'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}