'use client';

import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 font-sans">
      {/* Container Principal */}
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden border-b-8 border-[#ffcc00]">
        
        {/* Cabeçalho de Identidade UI-GovPe */}
        <div className="bg-[#004795] p-12 text-center">
          <div className="inline-block border-4 border-white p-3 mb-6">
            <span className="text-white font-black text-4xl uppercase tracking-tighter">
              Gov<span className="text-[#ffcc00]">PE</span>
            </span>
          </div>
          <h1 className="text-white text-2xl font-black uppercase tracking-widest mb-2">
            Plataforma Unificada
          </h1>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-normal opacity-80">
            Gestão de Inventário, Categorias e Auditoria
          </p>
        </div>

        {/* Área de Ações */}
        <div className="p-10 flex flex-col md:flex-row gap-6 justify-center items-center">
          
          {/* Botão de Login */}
          <Link 
            href="/login"
            className="group w-full md:w-64 flex flex-col items-center justify-center gap-4 p-8 border-2 border-[#004795] hover:bg-[#004795] transition-all duration-300 rounded-lg"
          >
            <LogIn className="w-10 h-10 text-[#004795] group-hover:text-white" />
            <span className="font-black text-[#004795] group-hover:text-white uppercase tracking-widest">
              Entrar
            </span>
          </Link>

          {/* Botão de Cadastro */}
          <Link 
            href="/register"
            className="group w-full md:w-64 flex flex-col items-center justify-center gap-4 p-8 border-2 border-[#004795] bg-[#004795] hover:bg-[#00356d] transition-all duration-300 rounded-lg"
          >
            <UserPlus className="w-10 h-10 text-white" />
            <span className="font-black text-white uppercase tracking-widest">
              Cadastrar
            </span>
          </Link>

        </div>

        {/* Rodapé Informativo */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Secretaria de Administração • Governo de Pernambuco
          </p>
        </div>
      </div>
    </main>
  );
}