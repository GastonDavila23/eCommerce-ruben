'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronDown, Info, Plus, Send } from 'lucide-react';
import ProductModal from '@/components/ProductModal';

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await supabase.from('categories').select('*');
      const { data: prod } = await supabase.from('products').select('*, categories(name)');
      if (cat) setCategories(cat);
      if (prod) setProducts(prod);
    };
    fetchData();
  }, []);

  const filteredProducts = filter 
    ? products.filter(p => p.category_id === filter) 
    : products;

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      {/* Header & Filtros */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 p-6 pb-2">
        <h1 className="text-3xl font-black italic mb-4 tracking-tighter">RUBÉN</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${!filter ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-100'}`}
          >
            TODOS
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === cat.id ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-100'}`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Listado con Acordeón */}
      <main className="px-6 mt-4 space-y-2">
        {filteredProducts.map((p) => (
          <div key={p.id} className="border-b border-gray-100">
            <button 
              onClick={() => setOpenId(openId === p.id ? null : p.id)}
              className="w-full py-5 flex justify-between items-center text-left"
            >
              <span className="font-bold text-lg">{p.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-gray-400">${p.price}</span>
                <motion.div animate={{ rotate: openId === p.id ? 180 : 0 }}>
                  <ChevronDown size={18} className="text-gray-300" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {openId === p.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {p.description || "Nuestra receta clásica elaborada con ingredientes frescos del día."}
                  </p>
                  <div className="flex gap-2 pb-6">
                    <button 
                      onClick={() => addToCart(p)}
                      className="flex-1 bg-black text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <Plus size={16} /> AGREGAR
                    </button>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      className="px-4 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </main>

      {/* Carrito Flotante (Igual al anterior) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 bg-black text-white p-6 rounded-[2rem] shadow-2xl z-30">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{cart.length} ITEMS</span>
            <span className="text-xl font-black">${total}</span>
          </div>
          <button className="w-full bg-[#25D366] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
            <Send size={18} /> PEDIR POR WHATSAPP
          </button>
        </div>
      )}

      {/* Modal de Detalle */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAdd={() => {
          addToCart(selectedProduct);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}