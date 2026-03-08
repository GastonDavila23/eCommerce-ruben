'use client';
import { useState } from 'react';
import { Plus, X, CheckCircle2, Loader2, ImageIcon, UploadCloud } from 'lucide-react';

export default function ProductFormEditor({ formData, setFormData, categories, loading, editingId, onSubmit, onReset, selectedFile,
  setSelectedFile }: any) {
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
    <form
      onSubmit={(e) => onSubmit(e, selectedFile)}
      className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-[#111] ${editingId ? 'border-orange-500/50' : 'border-white/5'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${editingId ? 'text-orange-400' : 'text-blue-400'}`}>
          <Plus size={14} /> {editingId ? 'Modificando Producto' : 'Nuevo Producto'}
        </h3>
        {editingId && <button type="button" onClick={onReset} className="bg-white/10 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase">Cancelar</button>}
      </div>

      <div className="space-y-4">
        {/* Zona de Imagen Optimizada */}
        <div className="relative group">
          <label className={`relative flex flex-col items-center justify-center w-full h-32 rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${selectedFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:bg-white/[0.08]'}`}>
            {selectedFile ? (
              <div className="flex items-center gap-3 p-4 w-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <ImageIcon className="text-emerald-500" size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-white uppercase truncate">{selectedFile.name}</p>
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); setSelectedFile(null); }} className="p-2 text-red-500"><X size={14} /></button>
              </div>
            ) : formData.image_url ? (
              <div className="relative w-full h-full flex items-center px-6 gap-4">
                <img src={formData.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="actual" />
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Click para cambiar imagen</span>
                <UploadCloud size={20} className="ml-auto text-gray-600" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <UploadCloud size={24} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Foto del Producto</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre del producto" className="w-full rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10" required />
        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descripción..." className="w-full rounded-2xl p-6 text-sm h-20 resize-none bg-white/5 text-white outline-none" />

        <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/5">
          <div className="flex gap-2">
            <input value={newIngredient} onChange={e => setNewIngredient(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())} placeholder="Ingrediente..." className="flex-1 bg-transparent border-b border-white/10 text-sm text-white outline-none p-2" />
            <button type="button" onClick={addIngredient} className="bg-white/10 p-2 rounded-xl text-white"><Plus size={18} /></button>
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
          <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="Precio $" className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none" required />
          <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none">
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