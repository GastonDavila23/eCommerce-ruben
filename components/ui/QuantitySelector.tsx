'use client';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuantitySelector({ product }: { product: any }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const item = cart.find((i: any) => i.id === product.id);
  const qty = item ? item.qty : 0;

  // Si no hay cantidad, no dibujamos nada.
  // El botón de "Agregar" lo maneja el padre (Card o Modal).
  if (qty === 0) return null;

  return (
    <div className="flex w-full items-center bg-gray-100 rounded-[1.5rem] h-[52px] overflow-hidden">
      <button 
        onClick={() => removeFromCart(product.id)}
        className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors text-black"
      >
        {qty === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={18} />}
      </button>
      
      <span className="flex-1 text-center font-black text-sm italic">
        {qty}
      </span>
      
      <button 
        onClick={() => addToCart(product)}
        className="flex-1 h-full flex items-center justify-center active:bg-gray-200 transition-colors text-black"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}