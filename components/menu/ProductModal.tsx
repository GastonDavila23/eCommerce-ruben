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
        className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md p-4 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-100 w-[90%] h-[90%] max-w-lg overflow-hidden flex flex-col shadow-2xl relative"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Botón */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black p-2 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          {/* Cabecera */}
          <div className="relative h-[40%] bg-gray-50 flex-shrink-0">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 uppercase font-black text-2xl italic">
                Rubén
              </div>
            )}
          </div>

          {/* Contenido del Modal */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
            
            {/* Título y Categoría */}
            <div className="text-center mb-6">
              <span className="text-1xl font-black text-gray-400 uppercase tracking-[0.2em]">
                {product.categories?.name || 'Producto'}
              </span>
              <h2 className="text-2xl font-black leading-tight italic uppercase tracking-tighter text-black mt-1">
                {product.name}
              </h2>
            </div>

            {/* Zona Central: Descripción Resaltada */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
              <div className="bg-white p-5 rounded-3xl">
                <p className="text-1xl text-gray-700 leading-relaxed italic text-center">
                  {product.description || "Nuestra preparación especial con ingredientes premium seleccionados por Rubén para garantizar el mejor sabor."}
                </p>
              </div>

              {/* Ingredientes */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-1xl font-black uppercase text-gray-400 tracking-[0.2em] text-center">
                    Ingredientes
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.ingredients.map((ing: string, index: number) => (
                      <div key={index} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-[11px] font-bold text-gray-600 lowercase">{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer: Precio y Selector */}
            <div className="p-2 bg-white mt-auto rounded-full">
              <div className="flex justify-center items-center">
                <p className="text-3xl font-black text-black tracking-tighter">${product.price}</p>
              </div>
              <QuantitySelector product={product} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}