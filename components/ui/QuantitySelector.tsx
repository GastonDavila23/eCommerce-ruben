'use client';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuantitySelector({ product }: { product: any }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const item = cart.find((i: any) => i.id === product.id);
  const qty = item ? item.qty : 0;

  if (qty === 0) return null;

  return (
    <div className="flex w-full items-center bg-gray-100 rounded-xl h-[42px] overflow-hidden border border-gray-200">
      <button 
        onClick={() => removeFromCart(product.id)}
        className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors"
      >
        {qty === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
      </button>
      
      <span className="flex-1 text-center font-black text-xs italic">{qty}</span>
      
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}