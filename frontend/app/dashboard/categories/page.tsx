'use client';

import { useEffect, useState } from 'react';
import api from '../../../src/services/api';
import { Tags, Plus, Trash2, Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  // ESTADO PARA ARMAZENAR O PERFIL DO USUÁRIO
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Busca o role do usuário no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { role } = JSON.parse(storedUser);
      setUserRole(role);
    }
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSending(true);
    try {
      await api.post('/categories', { name: newCategory.trim() });
      setNewCategory('');
      await loadCategories(); 
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor";
      alert(`Falha: ${msg}`);
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("DESEJA REALMENTE EXCLUIR ESTA CATEGORIA?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((cat: any) => cat.id !== id));
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao excluir categoria";
      alert(`Erro: ${msg}`);
    }
  }

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Categorias</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Classificação do Inventário Público</p>
      </header>

      {/* Formulário de Adição - Liberado para todos conforme seu código atual */}
      <section className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
        <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nome da Nova Categoria</label>
            <input 
              type="text"
              className="w-full bg-gray-50 border border-gray-200 p-3 text-xs text-black font-bold uppercase outline-none focus:border-[#004795] transition-all"
              placeholder="EX: HARDWARE, MOBILIÁRIO..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={sending}
            className="bg-[#004795] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#00356d] transition-all flex items-center gap-2 disabled:bg-gray-300 shadow-lg"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Adicionar</>}
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading ? (
          categories.map((cat: any) => (
            <div key={cat.id} className="bg-white p-4 border border-gray-100 shadow-sm flex justify-between items-center group hover:border-[#004795] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#004795]">
                  <Tags className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-700 uppercase">{cat.name}</span>
                  {cat._count && (
                    <span className="text-[8px] font-bold text-gray-400 uppercase">
                      {cat._count.products} ATIVOS VINCULADOS
                    </span>
                  )}
                </div>
              </div>
              
              {/* CORREÇÃO: O botão só aparece para ADMIN */}
              {userRole === 'ADMIN' && (
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  title="EXCLUIR CATEGORIA"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <Loader2 className="w-4 h-4 animate-spin text-[#004795]" />
        )}
      </div>
    </div>
  );
}