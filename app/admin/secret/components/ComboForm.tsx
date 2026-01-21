'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Trash2, Loader2, Pencil, ImageIcon } from 'lucide-react';

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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <form 
        ref={formRef} 
        onSubmit={handleUploadCombo} 
        className={`p-6 md:p-8 rounded-[2.5rem] shadow-xl space-y-4 transition-all duration-500 border ${
          editingId ? 'bg-orange-600 border-orange-400' : 'bg-gradient-to-br from-orange-600 to-red-700 border-transparent'
        }`}
      >
        <input type="hidden" name="currentImageUrl" />
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} /> {editingId ? 'Modificando Promo' : 'Nueva Promo en Slider'}
          </h3>
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); formRef.current?.reset(); }} 
              className="bg-white/20 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase"
            >
              Cancelar
            </button>
          )}
        </div>
        
        <input name="title" placeholder="Título de la promo" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-orange-100 outline-none border-none" required />
        <textarea name="description" placeholder="¿Qué incluye este combo?" className="w-full bg-white/20 rounded-2xl p-6 text-sm text-white placeholder:text-orange-100 h-24 resize-none outline-none border-none" required />
        <input name="price" type="number" placeholder="Precio $" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white outline-none border-none placeholder:text-orange-100" required />
        
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black text-orange-100 uppercase tracking-widest ml-2 italic">Imagen del combo</label>
          <input type="file" name="image" className="text-[10px] font-bold text-orange-100" />
        </div>

        <button disabled={loading} className="w-full bg-white text-orange-600 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center">
          {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Guardar Cambios' : 'Publicar Promo'}
        </button>
      </form>
      <div className="grid gap-3">
        {combos.map(c => (
          <div key={c.id} className="flex items-center bg-[#1A1612] p-3 rounded-[2rem] border border-orange-500/10 gap-3">
            {/* Imagen Fija */}
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
              {c.image_url ? (
                <img src={c.image_url} className="w-full h-full object-cover" alt={c.title} />
              ) : (
                <ImageIcon className="text-orange-500/20" size={18} />
              )}
            </div>

            {/* Texto con Truncado */}
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[13px] text-orange-100 block leading-tight truncate">
                {c.title}
              </span>
              <span className="text-[10px] text-orange-500 font-black italic mt-1 block">
                $ {c.price}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
              <button 
                onClick={() => startEdit(c)} 
                className="w-9 h-9 flex items-center justify-center bg-white/5 text-white rounded-full active:scale-90 transition-transform"
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={async () => { if(confirm('¿Borrar combo?')) { await supabase.from('combos').delete().eq('id', c.id); fetchCombos(); } }} 
                className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full active:scale-90 transition-transform"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}