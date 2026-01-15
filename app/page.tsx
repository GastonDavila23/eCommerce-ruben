'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';
import ProductModal from '@/components/ProductModal';
import QuantitySelector from '@/components/QuantitySelector';
import Navbar from '@/components/Navbar';
import FloatingCart from '@/components/FloatingCart';

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // 1. Carga de datos desde Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await supabase.from('categories').select('*').order('name');
      const { data: prod } = await supabase.from('products').select('*, categories(name)');
      if (cat) setCategories(cat);
      if (prod) setProducts(prod);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-48">
      
      {/* Header Fijo con Filtros */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 px-6 pt-10 pb-4 border-b border-gray-50">
        <h1 className="text-4xl font-black italic tracking-tighter leading-none mb-6">RUBÉN</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setFilter(null)} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!filter ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setFilter(cat.id)} 
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === cat.id ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Listado de Productos con Acordeón */}
      <main className="px-6 py-6 space-y-1">
        {products.filter(p => !filter || p.category_id === filter).map((p) => (
          <div key={p.id} className="border-b border-gray-50">
            <button 
              onClick={() => setOpenId(openId === p.id ? null : p.id)} 
              className={`w-full py-6 flex justify-between items-center text-left transition-all ${openId && openId !== p.id ? 'opacity-30' : 'opacity-100'}`}
            >
              <div className="flex flex-col">
                <span className="font-black text-xl italic uppercase tracking-tighter leading-none">{p.name}</span>
                <span className="text-gray-400 font-bold text-sm mt-1">${p.price}</span>
              </div>
              <motion.div 
                animate={{ rotate: openId === p.id ? 180 : 0 }} 
                className="bg-gray-50 p-2 rounded-full"
              >
                <ChevronDown size={18} className="text-gray-300" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === p.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-500 mb-6 italic">
                    {p.description || "Nuestra especialidad artesanal preparada con ingredientes frescos."}
                  </p>
                  <div className="flex gap-2 pb-8">
                    {/* El selector ahora es independiente */}
                    <QuantitySelector product={p} />
                    
                    <button 
                      onClick={() => setSelectedProduct(p)} 
                      className="px-6 bg-gray-100 text-gray-400 rounded-[1.5rem] flex items-center justify-center active:scale-95 transition-all hover:text-black"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </main>

      {/* Carrito Circular Flotante (Se abre al tocarlo) */}
      <FloatingCart />

      {/* Navegación Inferior Estilo App */}
      <Navbar />

      {/* Modal de Detalle */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}