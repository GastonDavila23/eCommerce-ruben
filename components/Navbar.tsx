'use client';
import { Utensils, Search, User, Home } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-50 px-8 py-4 flex justify-between items-center z-40 pb-8">
      <button className="flex flex-col items-center gap-1 text-black">
        <Home size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-300">
        <Search size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Buscar</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-300">
        <Utensils size={20} />
        <span className="text-[8px] font-black uppercase tracking-widest">Menú</span>
      </button>
    </div>
  );
}