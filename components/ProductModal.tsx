'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Utensils } from 'lucide-react';

export default function ProductModal({ product, onClose, onAdd }: any) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-end justify-center"
      >
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Imagen con botón cerrar */}
          <div className="relative h-64 bg-gray-100">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            )}
            <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full border border-white/30">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto">
            <div>
              <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase tracking-widest">
                {product.categories?.name}
              </span>
              <h2 className="text-3xl font-black mt-2 leading-none italic uppercase">{product.name}</h2>
              <p className="text-2xl font-bold mt-2 text-gray-400">${product.price}</p>
            </div>

            <div className="flex justify-between border-y border-gray-50 py-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <Clock size={16} /> 15-20 min
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                <Flame size={16} /> Artesanal
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] mb-3">Descripción</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "Nuestra preparación especial con ingredientes premium seleccionados. Una explosión de sabor en cada bocado siguiendo la receta tradicional de Rubén."}
              </p>
            </div>

            <button 
              onClick={onAdd}
              className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest"
            >
              Agregar al carrito
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}