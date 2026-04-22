'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../src/services/api';
import Link from 'next/link';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { access_token, user } = response.data;

      // 1. Armazenamento no LocalStorage (Para uso nos componentes)
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // 2. Armazenamento em Cookie (ESSENCIAL para o Middleware de proteção de rotas)
      document.cookie = `auth_token=${access_token}; path=/; max-age=86400`; // 24h
      document.cookie = `user_role=${user.role}; path=/; max-age=86400`;

      // 3. REDIRECIONAMENTO INTELIGENTE
      // Se for ADMIN, vai para a visão geral. Se for USER, vai para produtos.
      if (user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/products');
      }
      
    } catch (err: any) {
      const message = err.response?.data?.message || 'Credenciais inválidas. Verifique seu e-mail e senha.';
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
            <ArrowLeft className="w-3 h-3" /> Início
          </Link>
          
          <h2 className="text-gray-800 text-lg font-black uppercase tracking-tighter">
            Identificação
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Acesso Restrito ao Sistema
          </p>
        </div>

        <form onSubmit={handleLogin} className="px-10 pb-10 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 border-l-4 border-red-500 text-[11px] font-bold uppercase">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">
              E-mail Institucional
            </label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#004795] outline-none text-xs font-medium transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest">
                Senha
              </label>
              <Link href="#" className="text-[9px] font-bold text-gray-400 uppercase hover:text-[#004795]">
                Esqueceu a senha?
              </Link>
            </div>
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
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#004795] hover:bg-[#00356d]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            {loading ? 'Validando...' : 'Acessar Sistema'}
          </button>

          <div className="text-center mt-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Novo por aqui?{' '}
              <Link href="/register" className="text-[#004795] hover:underline">
                Crie sua conta agora
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
          Tecnologia da Informação • Governo de Pernambuco
        </p>
      </div>
    </main>
  );
}