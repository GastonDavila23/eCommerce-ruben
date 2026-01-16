'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Trash2, Camera, Loader2 } from 'lucide-react';

export default function ComboForm() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCombos(); }, []);

  const fetchCombos = async () => {
    const { data } = await supabase.from('combos').select('*').order('created_at', { ascending: false });
    setCombos(data || []);
  };

  const handleUploadCombo = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const file = form.image.files[0];
    let imageUrl = '';

    try {
      if (file) {
        const fileName = `${Date.now()}_combo.${file.name.split('.').pop()}`;
        await supabase.storage.from('products').upload(fileName, file);
        imageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      await supabase.from('combos').insert([{
        title: form.title.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        image_url: imageUrl
      }]);

      form.reset();
      fetchCombos();
      alert("¡Combo publicado! 🔥");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUploadCombo} className="bg-orange-500 p-8 rounded-[2.5rem] space-y-4 shadow-xl shadow-orange-500/20">
        <h3 className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> Nuevo Combo Especial
        </h3>
        <input name="title" placeholder="Título del Combo" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-orange-100 border-none outline-none" required />
        <textarea name="description" placeholder="¿Qué incluye?" className="w-full bg-white/20 rounded-2xl p-6 text-sm text-white placeholder:text-orange-100 h-24 resize-none border-none outline-none" required />
        <input name="price" type="number" placeholder="Precio $" className="w-full bg-white/20 rounded-2xl px-6 py-4 text-sm text-white border-none outline-none" required />
        <input type="file" name="image" className="text-[10px] font-bold text-orange-100" />
        <button disabled={loading} className="w-full bg-white text-orange-600 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'PUBLICAR EN SLIDER'}
        </button>
      </form>

      <div className="grid gap-3">
        {combos.map(c => (
          <div key={c.id} className="flex justify-between items-center bg-[#1A1612] p-4 rounded-[2rem] border border-orange-500/10">
            <div className="flex items-center gap-4">
              <img src={c.image_url} className="w-12 h-12 rounded-xl object-cover" />
              <span className="font-bold text-sm text-orange-100">{c.title}</span>
            </div>
            <button onClick={async () => { await supabase.from('combos').delete().eq('id', c.id); fetchCombos(); }} className="p-3 text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}