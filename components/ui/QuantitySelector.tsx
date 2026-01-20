'use client';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuantitySelector({ product }: { product: any }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const item = cart.find((i: any) => i.id === product.id);
  const qty = item ? item.qty : 0;

  if (qty === 0) {
    return (
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 bg-black text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-black/10"
      >
        <Plus size={16} /> Agregar al Pedido
      </button>
    );
  }

  return (
    <div className="flex-1 flex items-center bg-gray-100 rounded-[1.5rem] h-[52px] overflow-hidden">
      <button 
        onClick={() => removeFromCart(product.id)}
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-black"
      >
        {qty === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={18} />}
      </button>
      
      <span className="flex-1 text-center font-black text-sm italic">
        {qty}
      </span>
      
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-black"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}