'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Pencil, ImageIcon, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ProductForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cat } = await supabase.from('categories').select('*').order('order', { ascending: true });
    const { data: prod } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    
    if (cat) {
      setCategories(cat);
      if (!formData.category_id && cat.length > 0) {
        setFormData(prev => ({ ...prev, category_id: cat[0].id }));
      }
    }
    if (prod) setProducts(prod);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      category_id: p.category_id,
      image_url: p.image_url || ''
    });
    // Scroll optimizado para que el formulario quede bien visible
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: categories[0]?.id || '',
      image_url: ''
    });
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (selectedFile) {
        // --- LÓGICA DE COMPRESIÓN AUTOMÁTICA ---
        const options = {
          maxSizeMB: 0.3, // Máximo 300KB
          maxWidthOrHeight: 1080,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(selectedFile, options);
        
        const fileExt = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      const pData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(pData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([pData]);
        if (error) throw error;
      }

      alert(editingId ? "¡Producto actualizado!" : "¡Producto publicado!");
      resetForm();
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-[#111] ${
          editingId ? 'border-orange-500/50' : 'border-white/5'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${editingId ? 'text-orange-400' : 'text-blue-400'}`}>
            <Plus size={14} /> {editingId ? 'Modificando Producto' : 'Nuevo Producto'}
          </h3>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-white/10 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
              <X size={12} /> Cancelar
            </button>
          )}
        </div>

        <div className="space-y-4">
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del producto"
            className="w-full rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10"
            required
          />
          
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción (ingredientes, peso, etc.)"
            className="w-full rounded-2xl p-6 text-sm h-24 resize-none bg-white/5 text-white outline-none focus:ring-1 ring-white/10"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Precio"
              className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10"
              required
            />
            
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10"
              required
            >
              {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">
              {editingId ? 'Cambiar imagen (opcional)' : 'Imagen del producto'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="text-[10px] font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-white/10 file:text-white"
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center ${
              editingId ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Guardar Cambios' : 'Publicar Producto'}
          </button>
        </div>
      </form>

      {/* LISTADO OPTIMIZADO PARA MÓVILES */}
      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="flex items-center bg-[#141414] border border-white/5 p-3 rounded-[2rem] gap-3 w-full overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {p.image_url ? (
                <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
              ) : (
                <ImageIcon className="text-white/10" size={18} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[13px] text-white truncate">{p.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 uppercase">${p.price}</span>
                <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400 font-bold uppercase truncate max-w-[80px]">
                  {p.categories?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
              <button onClick={() => startEdit(p)} className="w-9 h-9 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-full active:scale-90">
                <Pencil size={14} />
              </button>
              <button
                onClick={async () => {
                  if (confirm('¿Borrar producto?')) {
                    await supabase.from('products').delete().eq('id', p.id);
                    fetchData();
                  }
                }}
                className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full active:scale-90"
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