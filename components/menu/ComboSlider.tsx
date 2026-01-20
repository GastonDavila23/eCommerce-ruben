'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ComboSliderProps {
  combos: any[];
  filter: string | null;
  isOpen: boolean;
}

export default function ComboSlider({ combos, filter, isOpen }: ComboSliderProps) {
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {!filter && combos.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 px-6 overflow-hidden"
        >
          <h2 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] mb-4 flex items-center gap-2">
            <Clock size={12} /> Promos por Tiempo Limitado
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="min-w-[100%] relative aspect-[12/8] bg-black rounded-[2.5rem] overflow-hidden snap-center"
              >
                {combo.image_url && (
                  <img 
                    src={combo.image_url} 
                    alt={combo.title} 
                    className="w-full h-full object-cover opacity-70" 
                  />
                )}

                <div className="absolute inset-0 p-8 flex flex-col bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                  {/* Bloque Superior: Título y Descripción */}
                  <div className="flex-1">
                    <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter leading-none">
                      {combo.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-2 font-medium line-clamp-2 italic">
                      {combo.description}
                    </p>
                  </div>

                  {/* Bloque Inferior: Precio y Botón */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-white text-xl font-black italic">${combo.price}</span>
                    <button
                      onClick={() => addToCart({ ...combo, name: combo.title })}
                      disabled={!isOpen}
                      className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                        isOpen
                          ? 'bg-white text-black active:scale-95 shadow-lg'
                          : 'bg-white/20 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      {isOpen ? '+ Agregar' : 'Cerrado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}