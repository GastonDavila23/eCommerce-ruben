'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, CheckCircle2 } from 'lucide-react';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function ProductModal({ product, onClose }: any) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm p-4 flex items-end justify-center"
      >
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Cabecera con Imagen */}
          <div className="relative h-72 bg-gray-100 flex-shrink-0">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200 uppercase font-black text-4xl italic tracking-tighter">
                Rubén
              </div>
            )}
            
            {/* Botón de cierre flotante */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 bg-black/20 backdrop-blur-md text-white p-2 rounded-full border border-white/30 active:scale-90 transition-transform"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
            {/* Título y Categoría */}
            <div className="space-y-2">
              <span className="text-[10px] font-black bg-gray-100 px-4 py-1.5 rounded-full text-gray-400 uppercase tracking-[0.2em]">
                {product.categories?.name}
              </span>
              <div className="flex justify-between items-start pt-1">
                <h2 className="text-4xl font-black leading-none italic uppercase tracking-tighter">
                  {product.name}
                </h2>
                <p className="text-2xl font-black text-black">${product.price}</p>
              </div>
            </div>

            {/* Info rápida */}
            <div className="flex justify-between border-y border-gray-50 py-5">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock size={16} className="text-gray-200" /> {product.cooking_time || "15-20 min"}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Flame size={16} className="text-gray-200" /> Elaboración Propia
              </div>
            </div>

            {/* Ingredientes (si existen) */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] mb-4">Ingredientes Principales</h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing: string, index: number) => (
                    <div key={index} className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-100">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-xs font-bold text-gray-600 lowercase">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">Descripción</h4>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                {product.description || "Nuestra preparación especial con ingredientes premium seleccionados por Rubén para garantizar el mejor sabor."}
              </p>
            </div>

            {/* Selector de Cantidad (Global) */}
            <div className="pt-4 pb-2">
              <QuantitySelector product={product} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}