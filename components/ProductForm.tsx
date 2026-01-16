'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Camera, Loader2, Clock, ListChecks, DollarSign, Package, UtensilsCrossed } from 'lucide-react';

export default function ProductForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cat } = await supabase.from('categories').select('*').order('name');
    const { data: prod } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });

    if (cat) setCategories(cat);
    if (prod) setProducts(prod);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const file = form.image.files[0];
    let imageUrl = '';

    try {
      if (file) {
        const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const ingredientsArray = form.ingredients.value
        .split(',')
        .map((i: string) => i.trim())
        .filter((i: string) => i !== "");

      const { error: dbError } = await supabase.from('products').insert([{
        name: form.name.value,
        description: form.description.value,
        ingredients: ingredientsArray,
        price: parseFloat(form.price.value),
        cooking_time: form.cooking_time.value || "15-20 min",
        category_id: form.category.value,
        image_url: imageUrl
      }]);

      if (dbError) throw dbError;

      alert("¡Producto cargado con éxito! 🍕");
      form.reset();
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que querés borrar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-12">
      {/* Formulario de Carga */}
      <section className="bg-white rounded-[2.5rem] p-8 space-y-5 shadow-2xl border border-gray-100">
        <h2 className="text-black text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
          <Plus size={14} className="text-gray-400" /> Cargar Nuevo Plato
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input name="name" placeholder="Nombre (ej: Pizza Muzzarella)" className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black transition-all" required />
          </div>

          <textarea name="description" placeholder="Descripción breve..." className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black transition-all h-24 resize-none" required />

          <div className="relative">
            <ListChecks className="absolute left-4 top-4 text-gray-300" size={18} />
            <textarea name="ingredients" placeholder="Ingredientes (separados por coma)" className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder:text-gray-400 focus:ring-2 focus:ring-black transition-all h-20 resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input name="price" type="number" placeholder="Precio" className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm text-black border-none" required />
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input name="cooking_time" placeholder="Tiempo" defaultValue="15-20 min" className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm text-black border-none" />
            </div>
          </div>

          <select name="category" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm text-black appearance-none font-medium" required>
            <option value="">Seleccionar Categoría</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 hover:border-black transition-all group">
            <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
              <Camera size={28} className="text-gray-300 group-hover:text-black transition-colors" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-black transition-colors">Seleccionar Foto</span>
              <input name="image" type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <button disabled={loading} className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2 disabled:bg-gray-300">
            {loading ? <Loader2 className="animate-spin" /> : 'PUBLICAR PRODUCTO'}
          </button>
        </form>
      </section>

      {/* Listado de Productos */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] px-4 flex items-center gap-2">
          <UtensilsCrossed size={12} /> Productos Online ({products.length})
        </h2>
        <div className="grid gap-3">
          {products.map(p => (
            <div key={p.id} className="flex justify-between items-center bg-[#141414] border border-white/5 p-4 rounded-[2rem] group hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-800 rounded-2xl overflow-hidden">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-600 uppercase italic tracking-tighter">${p.price}</span>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{p.categories?.name}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}