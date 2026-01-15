'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Plus, Minus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, removeFromCart, total, totalItems } = useCart();

  const sendWhatsApp = () => {
    const phone = "2616948318";
    const items = cart.map((i: any) => `• ${i.qty}x ${i.name}`).join('\n');
    const msg = encodeURIComponent(`¡Hola Rubén! Mi pedido:\n\n${items}\n\n*Total: $${total}*`);
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
              className="bg-white w-full max-w-md rounded-t-[3rem] p-8 max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic italic tracking-tighter uppercase">Tu Pedido</h2>
                <button onClick={() => setIsOpen(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 font-bold uppercase text-xs tracking-widest">El carrito está vacío</p>
                ) : (
                  cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <p className="font-black uppercase text-sm italic">{item.name}</p>
                        <p className="text-gray-400 font-bold text-xs">${item.price * item.qty}</p>
                      </div>
                      <div className="flex items-center bg-gray-50 rounded-full px-2">
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-black"><Minus size={14} /></button>
                        <span className="w-8 text-center font-black text-xs italic">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="p-2 text-black"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Total Estimado</span>
                    <span className="text-3xl font-black italic tracking-tighter">${total}</span>
                  </div>
                  <button onClick={sendWhatsApp} className="w-full bg-[#25D366] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
                    <Send size={18} /> Confirmar pedido
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}