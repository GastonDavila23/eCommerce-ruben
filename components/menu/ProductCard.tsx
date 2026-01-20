'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Plus } from 'lucide-react';
import QuantitySelector from '../ui/QuantitySelector';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, isOpenBusiness, onOpenModal }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="border-b border-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left outline-none"
      >
        <div className="flex flex-col">
          <span className="font-black text-xl italic uppercase tracking-tighter leading-none">
            {product.name}
          </span>
          <span className="text-gray-400 font-bold text-sm mt-1">${product.price}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="bg-gray-50 p-2 rounded-full">
          <ChevronDown size={18} className="text-gray-300" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-500 mb-6 italic pr-12 leading-relaxed">
              {product.description || "Nuestra especialidad artesanal preparada con ingredientes frescos."}
            </p>

            <div className="flex flex-col gap-6 pb-8">
              {/* SELECTOR DE CANTIDAD LIMPIO */}
              <div className="flex justify-start">
                <QuantitySelector product={product} />
              </div>

              {/* GRILLA 50/50 - SIN BOTONES EXTRA */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => addToCart(product)}
                  disabled={!isOpenBusiness}
                  className={`py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    isOpenBusiness ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus size={16} /> Agregar
                </button>

                <button
                  onClick={() => onOpenModal(product)}
                  className="py-4 bg-gray-100 text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-200 active:scale-95 transition-all"
                >
                  <Info size={16} /> Detalles
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}