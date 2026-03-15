'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Plus, Minus, Send, Clock, Truck, Store, Banknote, CreditCard, Candy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartProps {
  isOpenBusiness: boolean;
}

export default function FloatingCart({ isOpenBusiness }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, removeFromCart, total, totalItems } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'retiro'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [kioscoExtra, setKioscoExtra] = useState('');

  if (cart.length === 0) return null;

  const sendWhatsApp = () => {
    if (!isOpenBusiness) return;
    const phone = "5492634325471";
    const items = cart.map((i: any) => `• ${i.qty}x ${i.name}`).join('\n');
    let msg = `¡Hola Rubén! 👋 Mi pedido:\n\n${items}\n\n`;
    msg += `--- \n`;
    msg += `📍 *Entrega:* ${deliveryMethod === 'delivery' ? 'Delivery' : 'Local'}\n`;
    msg += `💳 *Pago:* ${paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}\n`;

    if (kioscoExtra.trim()) {
      msg += `🍬 *Extra Kiosco:* ${kioscoExtra}\n`;
      msg += `_(Por favor, confírmame el precio de los extras)_\n`;
    }

    msg += `\n*Total Comida: $${total}*\n`;
    msg += `--- \n¿Me confirmás el pedido?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 pb-10 max-h-[92vh] flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
            >
              {/* Header del Carrito */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black italic tracking-tighter uppercase">Tu Pedido</h2>
                <button onClick={() => setIsOpen(false)} className="bg-gray-100 p-2 rounded-full"><X size={18} /></button>
              </div>

              {/* Lista de Productos */}
              <div className="space-y-3 mb-6">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 font-bold uppercase text-[9px] tracking-widest">Vacío</p>
                ) : (
                  cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex flex-col">
                        <span className="font-black uppercase text-xs italic">{item.name}</span>
                        <span className="text-gray-400 font-bold text-[10px]">${item.price * item.qty}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 rounded-full scale-90">
                        <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-black"><Minus size={12} /></button>
                        <span className="w-6 text-center font-black text-xs italic">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="p-1.5 text-black"><Plus size={12} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="space-y-5">
                  {/* Selectores de Entrega y Pago */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-2">Entrega</p>
                      <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                        <button onClick={() => setDeliveryMethod('delivery')} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${deliveryMethod === 'delivery' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                          <Truck size={12} /> <span className="text-[9px] font-black uppercase italic">Envío</span>
                        </button>
                        <button onClick={() => setDeliveryMethod('retiro')} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${deliveryMethod === 'retiro' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                          <Store size={12} /> <span className="text-[9px] font-black uppercase italic">Retiro</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-2">Pago</p>
                      <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                        <button onClick={() => setPaymentMethod('efectivo')} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${paymentMethod === 'efectivo' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                          <Banknote size={12} /> <span className="text-[9px] font-black uppercase italic">Efectivo</span>
                        </button>
                        <button onClick={() => setPaymentMethod('transferencia')} className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${paymentMethod === 'transferencia' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                          <CreditCard size={12} /> <span className="text-[9px] font-black uppercase italic">Transf.</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Texto Kiosco */}
                  <div className="bg-gray-50 p-3 rounded-2xl flex items-start gap-3 border border-gray-100">
                    <Candy size={14} className="text-pink-500 mt-1 shrink-0" />
                    <textarea
                      placeholder="¿Algo más del kiosco? (Cigarrillos, snacks...)"
                      value={kioscoExtra}
                      onChange={(e) => setKioscoExtra(e.target.value)}
                      className="w-full bg-transparent text-[11px] font-bold outline-none resize-none h-10 placeholder:text-gray-300"
                    />
                  </div>
                  {/* Resumen y Botón de Confirmar */}
                  <div className="pt-2">
                    <div className="flex flex-col gap-1 mb-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em]">Subtotal Comida</span>
                        <span className="text-3xl font-black italic tracking-tighter leading-none">${total}</span>
                      </div>

                      {/* Aviso dinámico si hay extras */}
                      {kioscoExtra.trim() && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between items-center"
                        >
                          <span className="text-[9px] font-black uppercase text-pink-500 tracking-[0.1em] flex items-center gap-1">
                            <Candy size={10} /> + Extras Kiosco
                          </span>
                          <span className="text-[9px] font-bold text-pink-400 italic">Pendiente cotizar</span>
                        </motion.div>
                      )}
                    </div>

                    <button
                      onClick={sendWhatsApp}
                      disabled={!isOpenBusiness}
                      className={`w-full py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isOpenBusiness ? 'bg-[#25D366] text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {isOpenBusiness ? (
                        <>
                          <Send size={16} />
                          {kioscoExtra.trim() ? "Consultar Total Final" : "Confirmar pedido"}
                        </>
                      ) : (
                        <><Clock size={16} /> Local Cerrado</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}