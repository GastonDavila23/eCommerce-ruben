'use client';
import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductFormEditor from './ProductFormEditor';
import InventoryTable from './InventoryTable';
import { Sparkles, ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProductForm() {
  const { products, categories, combos, loading, isSavingPrices, upsertProduct, updateBulkPrices, fetchData } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category_id: '', image_url: '', ingredients: [] as string[] });

  const handleEditInit = (p: any) => {
    setEditingId(p.id);
    setFormData({ name: p.name, description: p.description || '', price: p.price.toString(), category_id: p.category_id, image_url: p.image_url || '', ingredients: Array.isArray(p.ingredients) ? p.ingredients : [] });
  };

  const handleFormSubmit = async (e: any, file: File | null) => {
    const success = await upsertProduct(formData, file, editingId);
    if (success) {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', category_id: categories[0]?.id || '', image_url: '', ingredients: [] });
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 pb-32">
      <ProductFormEditor 
        formData={formData} setFormData={setFormData}
        categories={categories} loading={loading}
        editingId={editingId} onSubmit={handleFormSubmit}
        onReset={() => setEditingId(null)}
      />

      <InventoryTable 
        products={products} isSavingPrices={isSavingPrices}
        onEdit={handleEditInit}
        onDelete={async (id: string) => { if(confirm('¿Borrar?')) { await supabase.from('products').delete().eq('id', id); fetchData(); } }}
        onSavePrices={updateBulkPrices}
      />

      {/* Listado de Combos optimizado */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black uppercase text-orange-500 tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> Promos Activas
        </h2>
        <div className="grid gap-3">
          {combos.map((c: any) => (
            <div key={c.id} className="flex items-center bg-[#1A1612] p-3 rounded-[2rem] border border-orange-500/10">
              <div className="w-10 h-10 rounded-xl bg-orange-500/5 overflow-hidden flex-shrink-0">
                {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-orange-500/10 m-auto" />}
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <h4 className="text-orange-100 text-[12px] font-bold truncate uppercase italic tracking-tighter">{c.title}</h4>
                <p className="text-[10px] text-orange-500/70 font-black">${c.price}</p>
              </div>
              <button onClick={async () => { if(confirm('¿Borrar combo?')) { await supabase.from('combos').delete().eq('id', c.id); fetchData(); } }} className="p-2 text-red-500 bg-red-500/10 rounded-full active:scale-75 transition-all"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}