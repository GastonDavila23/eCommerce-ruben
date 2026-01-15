'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Plus, Send, ShoppingCart } from 'lucide-react';
import ProductModal from '@/components/ProductModal';

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);

  // 1. Carga de datos desde Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Traemos categorías y productos con el nombre de su categoría asociada
      const { data: cat } = await supabase.from('categories').select('*').order('name');
      const { data: prod } = await supabase.from('products').select('*, categories(name)');
      
      if (cat) setCategories(cat);
      if (prod) setProducts(prod);
    };
    fetchData();
  }, []);

  // 2. Lógica de filtrado
  const filteredProducts = filter 
    ? products.filter(p => p.category_id === filter) 
    : products;

  // 3. Lógica del Carrito
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // 4. Envío a WhatsApp
  const sendWhatsApp = () => {
    const phone = "2616948318"; 
    
    const itemsMessage = cart
      .map(item => `• ${item.qty}x ${item.name} ($${item.price * item.qty})`)
      .join('\n');

    const message = encodeURIComponent(
      `¡Hola Rubén! 👋 Quiero hacer el siguiente pedido:\n\n` +
      `${itemsMessage}\n\n` +
      `*Total a pagar: $${total}*\n\n` +
      `¿Me confirmás el pedido para pasar la dirección?`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-40">
      
      {/* Header Fijo con Filtros Estilo Premium */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 px-6 pt-10 pb-4 border-b border-gray-50">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">RUBÉN</h1>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Carta 2026</div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setFilter(null)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!filter ? 'bg-black text-white border-black shadow-lg shadow-black/20' : 'bg-gray-50 text-gray-400 border-transparent'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === cat.id ? 'bg-black text-white border-black shadow-lg shadow-black/20' : 'bg-gray-50 text-gray-400 border-transparent'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Listado de Productos con Animaciones */}
      <main className="px-6 py-6">
        <div className="space-y-1">
          {filteredProducts.map((p) => (
            <div key={p.id} className="border-b border-gray-50">
              <button 
                onClick={() => setOpenId(openId === p.id ? null : p.id)}
                className={`w-full py-6 flex justify-between items-center text-left transition-all ${openId && openId !== p.id ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}`}
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
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed pr-8 italic">
                      {p.description || "Nuestra especialidad de la casa preparada con ingredientes seleccionados."}
                    </p>
                    <div className="flex gap-2 pb-8">
                      <button 
                        onClick={() => addToCart(p)}
                        className="flex-1 bg-black text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-black/10"
                      >
                        <Plus size={16} /> Agregar al Pedido
                      </button>
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
        </div>
      </main>

      {/* Carrito Flotante dinámico */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-6 right-6 z-50"
          >
            <div className="bg-black rounded-[2.8rem] p-7 shadow-2xl ring-8 ring-black/5">
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-3">
                   <div className="bg-white/10 w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/10">
                     {totalItems}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Subtotal</span>
                     <span className="text-2xl font-black italic tracking-tighter text-white leading-none">${total}</span>
                   </div>
                </div>
                <ShoppingCart size={24} className="text-white/20" />
              </div>
              <button 
                onClick={sendWhatsApp}
                className="w-full bg-[#25D366] py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all text-white"
              >
                <Send size={18} /> Confirmar WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalle que ya tienes creado */}
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