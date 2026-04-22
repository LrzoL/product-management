'use client';

import { useEffect, useState } from 'react';
import api from '../../../src/services/api';
import NewProductModal from '../../../src/components/newProductModal';
import { 
  Plus, Search, Package, Trash2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { role } = JSON.parse(storedUser);
        setUserRole(role);
      } catch (e) {
        console.error("Erro ao processar dados do usuário");
      }
    }
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await api.get(`/products?search=${search}&page=${page}`);
      const data = response.data.items || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar produtos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("DESEJA REALMENTE ELIMINAR ESTE ATIVO DO SISTEMA?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter((p: any) => p.id !== id));
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao excluir produto";
      alert(msg);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [search, page]);

  return (
    /* Container Principal com largura máxima da tela para evitar estouro */
    <div className="w-full max-w-full space-y-6 overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">

  
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Produtos Cadastrados</h1>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#004795] text-white px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#00356d] transition-all shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Novo Ativo
          </button>
        </div>
      </header>

      <div className="bg-white p-4 shadow-sm border border-gray-100 rounded-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input 
            type="text"
            placeholder="PESQUISAR PRODUTO PELO NOME..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-[11px] font-bold outline-none focus:border-[#004795] uppercase tracking-wider transition-all text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ÁREA DA TABELA: O segredo está aqui */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full text-left border-collapse table-fixed md:table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 font-black">
                {/* Larguras fixas para colunas ajudam a evitar a rolagem */}
                <th className="w-[50%] md:w-auto px-6 py-5 text-[10px] text-gray-400 uppercase tracking-[0.2em]">Informação do Ativo</th>
                <th className="w-[30%] md:w-auto px-6 py-5 text-[10px] text-gray-400 uppercase tracking-[0.2em]">Categoria Oficial</th>
                <th className="w-[20%] md:w-auto px-6 py-5 text-[10px] text-gray-400 uppercase tracking-[0.2em] text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length > 0 ? products.map((product: any) => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 bg-gray-50 flex items-center justify-center rounded-sm border border-gray-100 overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={`http://localhost:3001/${product.imageUrl}`} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-[#004795]" />
                        )}
                      </div>
                      {/* O 'min-w-0' no pai e 'truncate' no texto impede que a coluna empurre a tabela */}
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-800 uppercase leading-none mb-1 truncate">{product.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">
                          {product.description || "SEM DESCRIÇÃO TÉCNICA"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex">
                      <span className="text-[10px] font-black px-3 py-1 bg-[#004795]/10 text-[#004795] rounded-full uppercase tracking-tighter truncate max-w-full">
                        {product.categories?.[0]?.category?.name || product.category?.name || 'Inventário Geral'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {userRole === 'ADMIN' ? (
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[8px] font-bold text-gray-400 uppercase italic whitespace-nowrap">Apenas Admin</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                      {loading ? "Sincronizando..." : "Nenhum ativo encontrado"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Página {page}</p>
          <div className="flex gap-1">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 bg-white border border-gray-200 rounded-sm hover:text-[#004795] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-white border border-gray-200 rounded-sm hover:text-[#004795]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <NewProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadProducts}
      />
    </div>
  );
}