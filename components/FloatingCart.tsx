'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Plus, Minus, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartProps {
  isOpenBusiness: boolean; // Recibimos el estado del local desde el page.tsx
}

export default function FloatingCart({ isOpenBusiness }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, removeFromCart, total, totalItems } = useCart();

  const sendWhatsApp = () => {
    // Si el local está cerrado, no permitimos el envío
    if (!isOpenBusiness) return;

    const phone = "5492634325471";
    const items = cart.map((i: any) => `• ${i.qty}x ${i.name}`).join('\n');
    const msg = encodeURIComponent(`¡Hola Rubén! 👋 Mi pedido:\n\n${items}\n\n*Total a pagar: $${total}*\n\n¿Me confirmás el pedido?`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* Botón Circular Flotante */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        )}
      </button>

      {/* Panel del Carrito Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-8 max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Cabecera del Carrito */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Tu Pedido</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Revisá tu selección</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Lista de Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <ShoppingCart size={48} />
                    <p className="text-center font-black uppercase text-xs tracking-[0.3em] mt-4">Vacio</p>
                  </div>
                ) : (
                  cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div className="flex flex-col">
                        <span className="font-black uppercase text-sm italic leading-none">{item.name}</span>
                        <span className="text-gray-400 font-bold text-xs mt-1">${item.price * item.qty}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-black hover:bg-white rounded-full transition-colors shadow-sm"><Minus size={14} /></button>
                        <span className="w-8 text-center font-black text-xs italic">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="p-2 text-black hover:bg-white rounded-full transition-colors shadow-sm"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer con Total y Botón condicional */}
              {cart.length > 0 && (
                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">Total del pedido</span>
                    <span className="text-4xl font-black italic tracking-tighter leading-none">${total}</span>
                  </div>

                  {/* Botón de WhatsApp dinámico */}
                  <button 
                    onClick={sendWhatsApp}
                    disabled={!isOpenBusiness}
                    className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                      isOpenBusiness 
                      ? 'bg-[#25D366] text-white shadow-[#25D366]/20' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isOpenBusiness ? (
                      <><Send size={18} /> Confirmar vía WhatsApp</>
                    ) : (
                      <><Clock size={18} /> Local Cerrado</>
                    )}
                  </button>

                  {!isOpenBusiness && (
                    <p className="text-center text-[9px] font-bold text-red-400 uppercase tracking-widest px-4 leading-tight">
                      Podés armar el pedido ahora, pero Rubén solo recibe mensajes en horario de atención.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}