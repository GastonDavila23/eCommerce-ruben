'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Sparkles, Plus, Minus, Trash2 } from 'lucide-react';

export default function ComboSlider({ combos, isOpen }: any) {
  const { cart, addToCart, removeFromCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / (width * 0.85)); 
      setActiveIndex(index);
    }
  };

  if (!combos || combos.length === 0) return null;

  return (
    <div className="py-6 space-y-4 bg-gray-50">
      <div className="px-6 flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-2">
          <Sparkles size={12} className="text-orange-500" /> Promos por tiempo limitado
        </h2>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
      >
        {combos.map((combo: any) => {
          // Buscamos si el combo ya está en el carrito
          const cartItem = cart.find((i: any) => i.id === combo.id);
          const qty = cartItem ? cartItem.qty : 0;

          return (
            <div 
              key={combo.id}
              className="min-w-[85%] snap-center pl-6 first:pl-6 last:pr-6"
            >
              <div className="relative h-64 bg-black rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden border border-white/5 shadow-xl">
                {combo.image_url && (
                  <div className="absolute inset-0 z-0">
                    <img src={combo.image_url} className="w-full h-full object-cover opacity-50" alt={combo.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {combo.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-bold leading-tight line-clamp-2">
                    {combo.description}
                  </p>
                </div>

                <div className="relative z-10 flex justify-between items-end">
                  <span className="text-2xl font-black text-white italic tracking-tighter">
                    ${combo.price}
                  </span>
                  
                  {/* Contenedor de acción con ancho fijo para que no salte el diseño */}
                  <div className="w-32">
                    {qty === 0 ? (
                      <button
                        onClick={() => isOpen && addToCart(combo)}
                        disabled={!isOpen}
                        className={`w-full py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                          isOpen ? 'bg-white text-black' : 'bg-white/10 text-white/30'
                        }`}
                      >
                        <Plus size={14} /> Agregar
                      </button>
                    ) : (
                      /* Versión adaptada del QuantitySelector para el Slider oscuro */
                      <div className="flex w-full items-center bg-white/10 backdrop-blur-md rounded-full h-[42px] overflow-hidden border border-white/20 text-white">
                        <button 
                          onClick={() => removeFromCart(combo.id)}
                          className="flex-1 h-full flex items-center justify-center active:bg-white/10 transition-colors"
                        >
                          {qty === 1 ? <Trash2 size={14} className="text-red-400" /> : <Minus size={14} />}
                        </button>
                        
                        <span className="flex-1 text-center font-black text-xs italic">{qty}</span>
                        
                        <button 
                          onClick={() => addToCart(combo)}
                          className="flex-1 h-full flex items-center justify-center active:bg-white/10 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      {combos.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-1">
          {combos.map((_: any, i: number) => (
            <motion.div
              key={i}
              animate={{ 
                width: i === activeIndex ? 16 : 6,
                backgroundColor: i === activeIndex ? '#f97316' : '#333',
              }}
              className="h-1.5 rounded-full transition-all duration-300"
            />
          ))}
        </div>
      )}
    </div>
  );
}