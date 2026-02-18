'use client';
import { useState } from 'react';
import { Plus, X, CheckCircle2, Loader2 } from 'lucide-react';

export default function ProductFormEditor({ formData, setFormData, categories, loading, editingId, onSubmit, onReset }: any) {
  const [newIngredient, setNewIngredient] = useState('');

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({ ...formData, ingredients: [...formData.ingredients, newIngredient.trim()] });
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_: any, i: number) => i !== index) });
  };

  return (
    <form onSubmit={onSubmit} className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-[#111] ${editingId ? 'border-orange-500/50' : 'border-white/5'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${editingId ? 'text-orange-400' : 'text-blue-400'}`}>
          <Plus size={14} /> {editingId ? 'Modificando Producto' : 'Nuevo Producto'}
        </h3>
        {editingId && <button type="button" onClick={onReset} className="bg-white/10 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase">Cancelar</button>}
      </div>

      <div className="space-y-4">
        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nombre del producto" className="w-full rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10" required />
        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción..." className="w-full rounded-2xl p-6 text-sm h-20 resize-none bg-white/5 text-white outline-none" />

        <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/5">
          <div className="flex gap-2">
            <input value={newIngredient} onChange={e => setNewIngredient(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())} placeholder="Ingrediente..." className="flex-1 bg-transparent border-b border-white/10 text-sm text-white outline-none p-2" />
            <button type="button" onClick={addIngredient} className="bg-white/10 p-2 rounded-xl text-white"><Plus size={18}/></button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.ingredients.map((ing: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-[10px] text-white border border-white/5">
                <CheckCircle2 size={12} className="text-green-500" /> {ing}
                <X size={12} className="text-red-400 cursor-pointer" onClick={() => removeIngredient(idx)} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Precio $" className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none" required />
          <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none">
            {categories.map((c: any) => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
          </select>
        </div>

        <button disabled={loading} className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${editingId ? 'bg-orange-600' : 'bg-blue-600'} text-white shadow-xl`}>
          {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Guardar Cambios' : 'Publicar Producto'}
        </button>
      </div>
    </form>
  );
}