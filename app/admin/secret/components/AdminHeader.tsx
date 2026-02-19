'use client';
import { ShieldCheck, Zap } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="relative mb-12 pt-8 pb-8 text-center overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-orange-500/10 blur-[80px] -z-10" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 blur-[100px] -z-10" />

      <div className="inline-flex flex-col items-center">
        {/* Badge superior sutil */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
          <ShieldCheck size={10} className="text-emerald-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
            Sesión Segura
          </span>
        </div>

        {/* Título Principal con Gradiente y Estilo Italizado */}
        <h1 className="relative group">
          <span className="text-5xl font-black tracking-tighter uppercase bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            CARTA ADMIN
          </span>
        </h1>

        {/* Subtítulo con espaciado pro */}
        <div className="relative mt-3 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-orange-500/50" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
            <Zap size={10} className="text-orange-500" />
            Panel de Control
          </p>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-orange-500/50" />
        </div>
      </div>

      {/* Decoración inferior sutil */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}