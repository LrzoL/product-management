'use client';

import { useState, useEffect, useRef } from 'react';
import api from '../../src/services/api';
import { X, Upload, Loader2, ImageIcon, Image as ImageIconLib } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewProductModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Estado para o preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/categories')
        .then(res => setCategories(res.data))
        .catch(err => console.error("Erro ao carregar categorias", err));
    }
  }, [isOpen]);

  // Limpa o preview quando o modal fecha ou o arquivo muda
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Por favor, selecione apenas arquivos de imagem.");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description || '');
      data.append('categoryId', formData.categoryId); 

      if (imageFile) {
        data.append('image', imageFile); 
      }

      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({ name: '', categoryId: '', description: '' });
      setImageFile(null);
      setPreviewUrl(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert(Array.isArray(msg) ? msg.join(", ") : msg || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#004795] p-4 flex justify-between items-center">
          <h2 className="text-white text-[11px] font-black uppercase tracking-widest">Novo Produto</h2>
          <button onClick={onClose} type="button" className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Nome do Produto</label>
            <input 
              required
              value={formData.name}
              placeholder="EX: MESA DE ESCRITÓRIO"
              className="w-full border border-gray-200 p-2.5 text-xs font-bold uppercase outline-none focus:border-[#004795] bg-gray-50 text-black placeholder:text-gray-300"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Categoria</label>
            <select 
              required
              value={formData.categoryId}
              className="w-full border border-gray-200 p-2.5 text-xs font-bold uppercase outline-none focus:border-[#004795] bg-gray-50 cursor-pointer text-black"
              onChange={e => setFormData({...formData, categoryId: e.target.value})}
            >
              <option value="" className="text-gray-400">Selecione uma categoria...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id} className="text-black">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Descrição</label>
            <textarea 
              value={formData.description}
              placeholder="DETALHES DO PRODUTO..."
              className="w-full border border-gray-200 p-2.5 text-xs font-bold uppercase outline-none focus:border-[#004795] bg-gray-50 h-24 resize-none text-black placeholder:text-gray-300"
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Área de Upload / Preview da Imagem */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Imagem do Produto</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed h-32 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 rounded-sm overflow-hidden ${
                imageFile ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-[#004795] bg-gray-50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" // Ajustado apenas para imagem
                onChange={handleFileChange}
              />
              
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-[9px] font-black uppercase">Trocar Imagem</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <ImageIconLib className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-[9px] font-black text-gray-400 uppercase">Clique para selecionar foto</p>
                  <span className="text-[8px] text-gray-300 font-bold uppercase">Apenas JPG ou PNG</span>
                </div>
              )}
            </div>
            {imageFile && (
               <p className="text-[8px] font-bold text-blue-600 uppercase mt-1 italic">
                 Arquivo: {imageFile.name}
               </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#004795] text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#00356d] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] mt-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Salvando...</span></>
            ) : (
              'Cadastrar Produto'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}