'use client';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuantitySelector({ product }: { product: any }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const item = cart.find((i: any) => i.id === product.id);
  const qty = item ? item.qty : 0;

  if (qty === 0) return null;

  return (
    <div className="flex w-full px-2 h-[42px] items-center bg-gray-200 rounded-full overflow-hidden">
  <button 
    onClick={() => removeFromCart(product.id)}
    className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors"
  >
    {qty === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
  </button>
  
  <span className="flex-1 text-center font-black text-sm italic text-app-fg">
    {qty}
  </span>
  
  <button 
    onClick={() => addToCart(product)}
    className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors"
  >
    <Plus size={16} />
  </button>
</div>
  );
}