'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Trash2, Loader2, Pencil, X, ImageIcon } from 'lucide-react';

export default function ComboForm() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { fetchCombos(); }, []);

  const fetchCombos = async () => {
    const { data } = await supabase.from('combos').select('*').order('created_at', { ascending: false });
    setCombos(data || []);
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    if (formRef.current) {
      const f = formRef.current;
      (f.elements.namedItem('title') as HTMLInputElement).value = c.title;
      (f.elements.namedItem('description') as HTMLTextAreaElement).value = c.description;
      (f.elements.namedItem('price') as HTMLInputElement).value = c.price.toString();
      (f.elements.namedItem('currentImageUrl') as HTMLInputElement).value = c.image_url || "";
      
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUploadCombo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const file = formData.get('image') as File;
    let imageUrl = (form.elements.namedItem('currentImageUrl') as HTMLInputElement)?.value || null;

    try {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}_combo.${file.name.split('.').pop()}`;
        await supabase.storage.from('products').upload(fileName, file);
        imageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      const comboData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        image_url: imageUrl,
        active: true
      };

      if (editingId) {
        await supabase.from('combos').update(comboData).eq('id', editingId);
        setEditingId(null);
      } else {
        await supabase.from('combos').insert([comboData]);
      }
      form.reset();
      fetchCombos();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <form 
        ref={formRef} 
        onSubmit={handleUploadCombo} 
        className={`p-8 rounded-[2.5rem] shadow-xl space-y-4 transition-all duration-500 border ${
          editingId ? 'bg-orange-600 border-orange-400' : 'bg-gradient-to-br from-orange-600 to-red-700 border-transparent'
        }`}
      >
        <input type="hidden" name="currentImageUrl" />
        <div className="flex justify-between items-center">
          <h3 className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} /> {editingId ? 'Modificando Promo' : 'Nueva Promo en Slider'}
          </h3>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); formRef.current?.reset(); }} className="text-white/70 text-[10px] font-black uppercase">Cancelar</button>
          )}
        </div>
        <input name="title" placeholder="Título" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-orange-100 outline-none border-none" required />
        <textarea name="description" placeholder="¿Qué incluye?" className="w-full bg-white/20 rounded-2xl p-6 text-sm text-white placeholder:text-orange-100 h-24 resize-none outline-none border-none" required />
        <input name="price" type="number" placeholder="Precio $" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white outline-none border-none" required />
        <input type="file" name="image" className="text-[10px] font-bold text-orange-100" />
        <button disabled={loading} className="w-full bg-white text-orange-600 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : editingId ? 'Guardar Cambios' : 'Publicar Promo'}
        </button>
      </form>

      <div className="grid gap-3">
        {combos.map(c => (
          <div key={c.id} className="flex justify-between items-center bg-[#1A1612] p-4 rounded-[2rem] border border-orange-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-orange-500/20" size={18} />}
              </div>
              <div>
                <span className="font-bold text-sm text-orange-100 block leading-none mb-1">{c.title}</span>
                <span className="text-[10px] text-orange-500 font-black italic">$ {c.price}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(c)} className="p-3 bg-white/10 text-white rounded-full active:scale-90 transition-transform"><Pencil size={16} /></button>
              <button onClick={async () => { if(confirm('¿Borrar?')) { await supabase.from('combos').delete().eq('id', c.id); fetchCombos(); } }} className="p-3 bg-red-500/10 text-red-500 rounded-full active:scale-90 transition-transform"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}