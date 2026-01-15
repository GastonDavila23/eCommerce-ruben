'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing?.qty === 1) return prev.filter(i => i.id !== productId);
      return prev.map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const clearCart = () => setCart([]);
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);