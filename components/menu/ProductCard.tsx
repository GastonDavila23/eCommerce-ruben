'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Plus } from 'lucide-react';
import QuantitySelector from '../ui/QuantitySelector';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, isOpenBusiness, onOpenModal }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart } = useCart(); //

  // Buscamos si el producto ya está en el carrito para decidir qué botón mostrar
  const cartItem = cart.find((item: any) => item.id === product.id);
  const isInCart = !!cartItem;

  return (
    <div className="bg-[#f9f9f9] p-2 border-b border-gray-50 rounded-2xl shadow-sm mb-2">
      {/* CABECERA DEL ACORDEÓN */}
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
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="bg-black p-2 rounded-2xl pr-4 pl-4">
          <ChevronDown size={18} className="text-white" />
        </motion.div>
      </button>

      {/* CONTENIDO DESPLEGABLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-500 mb-6 italic pr-12 leading-relaxed">
              {product.description || "Nuestra especialidad artesanal preparada con ingredientes frescos seleccionados por Rubén."}
            </p>

            {/* GRILLA DE ACCIÓN ÚNICA: Aquí es donde eliminamos el botón extra */}
            <div className="grid grid-cols-2 gap-3 w-full pb-8">
              
              <div className="w-full h-[52px]">
                {!isInCart ? (
                  /* BOTÓN AGREGAR INICIAL */
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!isOpenBusiness}
                    className={`w-full h-full rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                      isOpenBusiness ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={16} /> Agregar
                  </button>
                ) : (
                  /* SELECTOR DE CANTIDAD: Solo aparece si isInCart es true */
                  <QuantitySelector product={product} />
                )}
              </div>

              {/* BOTÓN DE DETALLES */}
              <button
                onClick={() => onOpenModal(product)}
                className="h-[52px] bg-gray-100 text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-200 active:scale-95 transition-all"
              >
                <Info size={16} /> Detalles
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}