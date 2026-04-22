'use client';

import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 font-sans">
     
      <div className="w-full max-w-lg bg-white shadow-xl rounded-sm overflow-hidden border-b-4 border-[#ffcc00]">
        
        <div className="bg-[#004795] p-8 text-center">
          <div className="inline-block border-2 border-white p-2 mb-4">
            <span className="text-white font-black text-2xl uppercase tracking-tighter">
              Gov<span className="text-[#ffcc00]">PE</span>
            </span>
          </div>
          <h1 className="text-white text-lg font-black uppercase tracking-widest mb-1">
            Plataforma Unificada de Produtos
          </h1>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider opacity-80">
            Gestão de Inventário, Categorias e Auditoria
          </p>
        </div>
        
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          <Link 
            href="/login"
            className="group w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-[#004795] hover:bg-[#004795] transition-all duration-300 rounded-sm"
          >
            <LogIn className="w-6 h-6 text-[#004795] group-hover:text-white" />
            <span className="font-black text-[11px] text-[#004795] group-hover:text-white uppercase tracking-widest">
              Entrar
            </span>
          </Link>

          <Link 
            href="/register"
            className="group w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-[#004795] bg-[#004795] hover:bg-[#00356d] transition-all duration-300 rounded-sm"
          >
            <UserPlus className="w-6 h-6 text-white" />
            <span className="font-black text-[11px] text-white uppercase tracking-widest">
              Cadastrar
            </span>
          </Link>

        </div>

        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em]">
         Governo de Pernambuco
          </p>
        </div>
      </div>
    </main>
  );
}