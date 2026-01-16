'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Clock, AlertCircle } from 'lucide-react';
import ProductModal from '@/components/ProductModal';
import QuantitySelector from '@/components/QuantitySelector';
import Navbar from '@/components/Navbar';
import FloatingCart from '@/components/FloatingCart';
import { useCart } from '@/context/CartContext';

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Carga paralela de todos los datos
      const [catRes, prodRes, combRes, schedRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, categories(name)'),
        supabase.from('combos').select('*').eq('active', true),
        supabase.from('schedules').select('*')
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (combRes.data) setCombos(combRes.data);

      // 2. Lógica de Horarios
      if (schedRes.data) {
        const now = new Date();
        const currentDay = now.getDay(); // 0-6
        const currentTime = now.getHours() * 100 + now.getMinutes(); // Formato 1930 para 19:30

        const todaySchedule = schedRes.data.find(s => s.day_of_week === currentDay);

        if (todaySchedule) {
          const open = parseInt(todaySchedule.open_time.replace(':', ''));
          const close = parseInt(todaySchedule.close_time.replace(':', ''));

          // Manejo simple de horarios (no contempla cierre después de medianoche aún)
          setIsOpen(currentTime >= open && currentTime <= close);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-48">

      {/* Header Fijo */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 px-6 pt-10 pb-4 border-b border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">RW-CARTA</h1>
          {/* Badge de Estado del Local */}
          <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-600' : 'bg-red-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'Abierto' : 'Cerrado'}</span>
          </div>
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
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === cat.id ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Slider de Combos - Solo se muestra si no hay filtro activo */}
      {/* Slider de Combos con Efecto Snap */}
      <AnimatePresence>
        {!filter && combos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 px-6 overflow-hidden"
          >
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] flex items-center gap-2">
                <Clock size={12} /> Promos Exclusivas
              </h2>
              {/* Indicador visual de cantidad */}
              <div className="text-[8px] font-black text-gray-200 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                Deslizá para ver más
              </div>
            </div>

            {/* Contenedor con Snap Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="min-w-[92%] relative aspect-[16/10] bg-black rounded-[2.5rem] overflow-hidden snap-center shadow-2xl shadow-black/20"
                >
                  {combo.image_url && (
                    <img src={combo.image_url} alt={combo.title} className="w-full h-full object-cover opacity-60" />
                  )}

                  {/* Overlay de información */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
                    <div className="mb-1">
                      <span className="bg-orange-500 text-[8px] font-black text-white px-2 py-1 rounded-lg uppercase tracking-widest">
                        Combo Destacado
                      </span>
                    </div>
                    <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none">
                      {combo.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-2 font-medium line-clamp-2 italic">
                      {combo.description}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Precio Especial</span>
                        <span className="text-white text-2xl font-black italic tracking-tighter leading-none">${combo.price}</span>
                      </div>

                      <button
                        onClick={() => addToCart({ ...combo, name: combo.title })}
                        disabled={!isOpen}
                        className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isOpen
                            ? 'bg-white text-black active:scale-90 shadow-xl shadow-white/10'
                            : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                          }`}
                      >
                        {isOpen ? 'Agregar Combo' : 'Cerrado'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Listado de Productos */}
      <main className="px-6 py-6">
        {/* Banner de Aviso si está Cerrado */}
        {!isOpen && (
          <div className="mb-8 p-4 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <div>
              <p className="text-xs font-black text-red-900 uppercase tracking-tight">Estamos fuera de horario</p>
              <p className="text-[11px] text-red-700/70 font-bold leading-tight mt-0.5">Puedes armar tu pedido, pero el botón de envío se habilitará cuando abramos.</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
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
                    <p className="text-sm text-gray-500 mb-6 italic pr-12">
                      {p.description || "Nuestra especialidad artesanal preparada con ingredientes frescos."}
                    </p>
                    <div className="flex gap-2 pb-8">
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
        </div>
      </main>

      {/* Carrito Flotante (Pasa el estado de apertura al componente si es necesario) */}
      <FloatingCart isOpenBusiness={isOpen} />

      <Navbar />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}