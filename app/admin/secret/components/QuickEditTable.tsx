'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuickEditTable() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('id, name, price, is_available, category_id, categories(name)')
      .order('name');
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleInputChange = (id: string, field: string, value: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    setSaving(true);
    try {
      const updates = products.map(p => 
        supabase.from('products').update({ 
          name: p.name, 
          price: parseFloat(p.price),
          is_available: p.is_available 
        }).eq('id', p.id)
      );
      await Promise.all(updates);
      setHasChanges(false);
      alert("¡Stock y precios actualizados!");
    } catch (error) {
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(products.length / rowsPerPage);
  const currentPageData = products.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  
  const paddedRows = [...currentPageData];
  while (paddedRows.length < rowsPerPage) {
    paddedRows.push({ id: `empty-${paddedRows.length}`, isEmpty: true });
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AnimatePresence>
        {hasChanges && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={saveAllChanges}
            className="fixed bottom-24 right-6 z-[60] bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Guardando...' : 'Confirmar Cambios'}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="w-full">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="w-[55%] p-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-left">Producto</th>
                <th className="w-[15%] p-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-center">Stock</th>
                <th className="w-[30%] p-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">Precio</th>
              </tr>
            </thead>
            <tbody className="relative">
              {paddedRows.map((p) => (
                <tr key={p.id} className={`border-b border-white/5 h-[75px] transition-opacity duration-300 ${p.isEmpty ? 'opacity-0' : 'opacity-100'}`}>
                  {!p.isEmpty ? (
                    <>
                      <td className="w-[55%] px-4 py-2 min-w-0">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleInputChange(p.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none text-white font-bold text-[13px] outline-none focus:bg-white/5 rounded-lg px-2 truncate"
                        />
                        <div className="px-2 text-[8px] text-gray-600 font-black uppercase truncate">{p.categories?.name}</div>
                      </td>
                      <td className="w-[15%]">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleInputChange(p.id, 'is_available', !p.is_available)}
                            className={`w-10 h-6 rounded-full transition-all flex items-center px-1 flex-shrink-0 ${p.is_available ? 'bg-green-600' : 'bg-red-900/40'}`}
                          >
                            <motion.div 
                              animate={{ x: p.is_available ? 16 : 0 }}
                              className="w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="w-[30%] px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-gray-500 font-black text-[11px]">$</span>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => handleInputChange(p.id, 'price', e.target.value)}
                            className="w-full max-w-[80px] bg-transparent border-none text-white font-black text-[15px] text-right outline-none focus:bg-white/5 rounded-lg pr-2"
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <td colSpan={3} className="h-[75px]"></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="p-3 text-gray-400 disabled:opacity-20 active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === page ? 'w-6 bg-orange-500' : 'w-1.5 bg-gray-700'}`} 
              />
            ))}
          </div>

          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="p-3 text-gray-400 disabled:opacity-20 active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}