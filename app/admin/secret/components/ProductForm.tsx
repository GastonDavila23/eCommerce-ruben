'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Pencil, ImageIcon } from 'lucide-react';

export default function ProductForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: cat } = await supabase.from('categories').select('*').order('order', { ascending: true });
    const { data: prod } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    if (cat) setCategories(cat);
    if (prod) setProducts(prod);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    if (formRef.current) {
      const f = formRef.current;
      (f.elements.namedItem('name') as HTMLInputElement).value = p.name;
      (f.elements.namedItem('description') as HTMLTextAreaElement).value = p.description || "";
      (f.elements.namedItem('price') as HTMLInputElement).value = p.price.toString();
      (f.elements.namedItem('category') as HTMLSelectElement).value = p.category_id;
      (f.elements.namedItem('currentImageUrl') as HTMLInputElement).value = p.image_url || "";

      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    const file = formData.get('image') as File;
    let imageUrl = (form.elements.namedItem('currentImageUrl') as HTMLInputElement)?.value || null;

    try {
      if (file && file.size > 0) {
        const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
        await supabase.storage.from('products').upload(fileName, file);
        imageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      const pData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        category_id: formData.get('category'),
        image_url: imageUrl
      };

      if (editingId) {
        await supabase.from('products').update(pData).eq('id', editingId);
        setEditingId(null);
      } else {
        await supabase.from('products').insert([pData]);
      }
      form.reset();
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* FORMULARIO DE GESTIÓN */}
      <form
        ref={formRef}
        onSubmit={handleUpload}
        className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${editingId ? 'bg-[#111] border-orange-400' : 'bg-[#111] border-white/5'
          }`}
      >
        <input type="hidden" name="currentImageUrl" />
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${editingId ? 'text-white' : 'text-blue-400'}`}>
            <Plus size={14} /> {editingId ? 'Modificando Producto' : 'Nuevo Producto'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); formRef.current?.reset(); }}
              className="bg-white/10 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="space-y-4">
          <input name="name" placeholder="Nombre del producto" className={`w-full rounded-2xl px-6 py-4 text-sm outline-none border-none ${editingId ? 'bg-white/10 text-white placeholder:text-gray-500' : 'bg-white/5 text-white'}`} required />
          <textarea name="description" placeholder="Descripción breve" className={`w-full rounded-2xl p-6 text-sm h-24 resize-none outline-none border-none ${editingId ? 'bg-white/10 text-white placeholder:text-gray-500' : 'bg-white/5 text-white'}`} />
          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" placeholder="Precio" className={`rounded-2xl px-6 py-4 text-sm outline-none border-none ${editingId ? 'bg-white/10 text-white placeholder:text-gray-500' : 'bg-white/5 text-white'}`} required />
            <select name="category" className={`rounded-2xl px-6 py-4 text-sm outline-none border-none ${editingId ? 'bg-white/10 text-white' : 'bg-white/5 text-white'}`} required>
              {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Imagen del producto</label>
            <input type="file" name="image" className={`text-[10px] font-bold ${editingId ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <button disabled={loading} className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${editingId ? 'bg-white text-orange-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : editingId ? 'Confirmar Edición' : 'Publicar Producto'}
          </button>
        </div>
      </form>

      {/* LISTA DE PRODUCTOS BLINDADA PARA MÓVILES */}
      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="flex items-center bg-[#141414] border border-white/5 p-3 rounded-[2rem] gap-3 w-full overflow-hidden">
            {/* IMAGEN: Tamaño fijo */}
            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {p.image_url ? (
                <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
              ) : (
                <ImageIcon className="text-white/10" size={18} />
              )}
            </div>

            {/* CONTENIDO: Toma todo el espacio disponible pero se corta si choca */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-bold text-[13px] text-white leading-tight truncate">
                {p.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex-shrink-0">
                  ${p.price}
                </span>
                {/* Badge de categoría opcional, también con truncado */}
                <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded-full text-gray-600 font-bold uppercase truncate max-w-[70px]">
                  {p.categories?.name}
                </span>
              </div>
            </div>

            {/* BOTONES: Prioridad absoluta, nunca se mueven */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
              <button
                onClick={() => startEdit(p)}
                className="w-9 h-9 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-full active:scale-90 transition-transform"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={async () => { if (confirm('¿Borrar?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }}
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