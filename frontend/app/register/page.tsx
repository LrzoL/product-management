'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/services/api';
import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Endpoint baseada na estrutura padrão do NestJS que configuramos
      await api.post('/users', { name, email, password });
      
      alert('Cadastro realizado com sucesso! Prossiga para o login.');
      router.push('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar conta. Tente outro e-mail.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f3f5] flex flex-col items-center justify-center p-6 font-sans text-black">
      <div className="w-full max-w-md bg-white shadow-lg rounded-sm overflow-hidden border-t-4 border-[#004795]">
        
        <div className="pt-8 pb-4 px-10">
          <Link href="/" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase hover:text-[#004795] transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" /> Voltar
          </Link>
          
          <h2 className="text-gray-800 text-lg font-black uppercase tracking-tighter">
            Criar Novo Perfil
          </h2>
        </div>

        <form onSubmit={handleRegister} className="px-10 pb-10 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 border-l-4 border-red-500 text-[11px] font-bold uppercase">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">
              Nome Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João Silva"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#004795] outline-none text-xs font-medium transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">
              E-mail Institucional
            </label>
            <input
              type="email"
              required
              placeholder="nome@dominio.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#004795] outline-none text-xs font-medium transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">
              Senha
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#004795] outline-none text-xs font-medium transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 mt-2 font-bold text-white uppercase tracking-widest text-[11px] shadow-sm transition-all ${
              loading ? 'bg-gray-400' : 'bg-[#004795] hover:bg-[#00356d]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {loading ? 'Processando...' : 'Finalizar Cadastro'}
          </button>

          <div className="text-center mt-4">
            <span className="text-[12px] text-gray-400 font-bold uppercase tracking-tighter">
              Já possui acesso?{' '}  <br></br> 
              <Link href="/login" className="text-[#004795] hover:underline">
                Faça login aqui
              </Link>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}