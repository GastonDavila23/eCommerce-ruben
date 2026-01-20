'use client';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function StatusBanner({ isOpen }: { isOpen: boolean }) {
  if (isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8 p-4 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-3 shadow-sm"
    >
      <div className="relative flex">
        <AlertCircle className="text-red-500 shrink-0 z-10" size={20} />
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20" />
      </div>
      
      <div>
        <p className="text-xs font-black text-red-900 uppercase tracking-tight">
          Estamos fuera de horario
        </p>
        <p className="text-[11px] text-red-700/70 font-bold leading-tight mt-0.5">
          Podés armar tu pedido, pero el botón de envío se habilitará cuando abramos.
        </p>
      </div>
    </motion.div>
  );
}