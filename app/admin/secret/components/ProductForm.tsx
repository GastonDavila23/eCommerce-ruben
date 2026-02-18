'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Trash2, Loader2, Pencil, ImageIcon, X, 
  CheckCircle2, List, ChevronLeft, ChevronRight, Search, Save, Sparkles 
} from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ProductForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // --- ESTADO DEL FORMULARIO COMPLETO ---
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    ingredients: [] as string[]
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- ESTADOS DE GESTIÓN DE TABLA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingPriceChanges, setPendingPriceChanges] = useState<Record<string, number>>({});
  const [isSavingPrices, setIsSavingPrices] = useState(false);
  const ROWS_PER_PAGE = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cat } = await supabase.from('categories').select('*').order('order', { ascending: true });
    const { data: prod } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    const { data: comb } = await supabase.from('combos').select('*').order('created_at', { ascending: false });
    
    if (cat) {
      setCategories(cat);
      if (!formData.category_id && cat.length > 0) {
        setFormData(prev => ({ ...prev, category_id: cat[0].id }));
      }
    }
    if (prod) setProducts(prod);
    if (comb) setCombos(comb);
  };

  // --- LÓGICA DE PRECIOS MASIVOS ---
  const handlePriceLocalChange = (productId: string, newPrice: string) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return;
    setPendingPriceChanges(prev => ({ ...prev, [productId]: priceNum }));
  };

  const saveAllPrices = async () => {
    setIsSavingPrices(true);
    try {
      const updates = Object.entries(pendingPriceChanges).map(([id, price]) => 
        supabase.from('products').update({ price }).eq('id', id)
      );
      await Promise.all(updates);
      setPendingPriceChanges({});
      alert("Precios actualizados correctamente");
      fetchData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSavingPrices(false);
    }
  };

  // --- GESTIÓN DE INGREDIENTES ---
  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, newIngredient.trim()] }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };

  // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ROWS_PER_PAGE) || 1;
  const currentProducts = useMemo(() => {
    const lastIndex = currentPage * ROWS_PER_PAGE;
    const firstIndex = lastIndex - ROWS_PER_PAGE;
    return filteredProducts.slice(firstIndex, lastIndex);
  }, [filteredProducts, currentPage]);

  const emptyRows = ROWS_PER_PAGE - currentProducts.length;

  // --- ACCIONES DE FORMULARIO ---
  const startEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      category_id: p.category_id,
      image_url: p.image_url || '',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : []
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({ name: '', description: '', price: '', category_id: categories[0]?.id || '', image_url: '', ingredients: [] });
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image_url;
      if (selectedFile) {
        const compressedFile = await imageCompression(selectedFile, { maxSizeMB: 0.3, maxWidthOrHeight: 1080 });
        const fileName = `${Date.now()}.jpg`;
        await supabase.storage.from('products').upload(fileName, compressedFile);
        finalImageUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      const pData = { ...formData, price: parseFloat(formData.price), image_url: finalImageUrl };
      if (editingId) await supabase.from('products').update(pData).eq('id', editingId);
      else await supabase.from('products').insert([pData]);

      resetForm();
      fetchData();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-10 pb-32 max-w-5xl mx-auto px-4 relative">
      
      {/* BOTÓN FLOTANTE DE GUARDADO MASIVO */}
      {Object.keys(pendingPriceChanges).length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
          <button 
            onClick={saveAllPrices}
            disabled={isSavingPrices}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3 border border-orange-400 animate-pulse"
          >
            {isSavingPrices ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Guardar {Object.keys(pendingPriceChanges).length} nuevos precios</>}
          </button>
        </div>
      )}

      {/* FORMULARIO COMPLETO */}
      <form ref={formRef} onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-[#111] ${editingId ? 'border-orange-500/50' : 'border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${editingId ? 'text-orange-400' : 'text-blue-400'}`}>
            <Plus size={14} /> {editingId ? 'Modificando Producto' : 'Nuevo Producto'}
          </h3>
          {editingId && <button type="button" onClick={resetForm} className="bg-white/10 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase">Cancelar</button>}
        </div>

        <div className="space-y-4">
          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nombre del producto" className="w-full rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none focus:ring-1 ring-white/10" required />
          
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción..." className="w-full rounded-2xl p-6 text-sm h-24 resize-none bg-white/5 text-white outline-none" />

          {/* Ingredientes */}
          <div className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/5">
            <div className="flex gap-2">
              <input value={newIngredient} onChange={e => setNewIngredient(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())} placeholder="Agregar ingrediente..." className="flex-1 bg-transparent border-b border-white/10 text-sm text-white outline-none p-2" />
              <button type="button" onClick={addIngredient} className="bg-white/10 p-2 rounded-xl text-white"><Plus size={18}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-[10px] text-white border border-white/5">
                  <CheckCircle2 size={12} className="text-green-500" />
                  {ing}
                  <X size={12} className="text-red-400 cursor-pointer" onClick={() => removeIngredient(idx)} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Precio $" className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none" required />
            <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="rounded-2xl px-6 py-4 text-sm bg-white/5 text-white outline-none">
              {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
            </select>
          </div>

          <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="text-[10px] text-gray-400 file:bg-white/10 file:text-white file:rounded-full file:border-0 file:px-4 file:py-2" />
          
          <button disabled={loading} className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center ${editingId ? 'bg-orange-600' : 'bg-blue-600'} text-white shadow-xl`}>
            {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Guardar Cambios' : 'Publicar Producto'}
          </button>
        </div>
      </form>

      {/* TABLA DE GESTIÓN */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List size={16} className="text-gray-500" />
              <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Inventario ({filteredProducts.length})</h2>
            </div>
            <span className="text-[9px] font-black text-gray-600 italic">Pág {currentPage} de {totalPages}</span>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Buscar por nombre o categoría..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white outline-none" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-[#141414] shadow-2xl">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-3 text-[9px] font-black uppercase text-gray-600 w-14">Img</th>
                <th className="p-3 text-[9px] font-black uppercase text-gray-600">Producto</th>
                <th className="p-3 text-[9px] font-black uppercase text-gray-600 w-24">Precio</th>
                <th className="p-3 text-[9px] font-black uppercase text-gray-600 w-20 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(p => (
                <tr key={p.id} className="border-b border-white/5 h-[64px]">
                  <td className="p-2 w-14">
                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/5">
                      {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-white/10" />}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold text-[12px] truncate uppercase italic tracking-tighter leading-tight">{p.name}</span>
                      <span className="text-[8px] text-gray-500 font-black uppercase truncate">{p.categories?.name}</span>
                    </div>
                  </td>
                  <td className="p-2 w-24">
                    <input 
                      type="number"
                      defaultValue={p.price}
                      onChange={(e) => handlePriceLocalChange(p.id, e.target.value)}
                      className={`w-full bg-white/5 border rounded-lg py-1 px-2 text-[12px] font-black italic outline-none transition-all ${pendingPriceChanges[p.id] !== undefined ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-white focus:border-white/20'}`}
                    />
                  </td>
                  <td className="p-2 w-20 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => startEdit(p)} className="w-7 h-7 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-md active:scale-90"><Pencil size={12}/></button>
                      <button onClick={async () => { if(confirm('¿Borrar?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-500 rounded-md active:scale-90"><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {Array.from({ length: emptyRows }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="border-b border-white/[0.02] h-[64px] opacity-10">
                  <td colSpan={4} className="p-2 text-center text-[8px] text-gray-700 uppercase tracking-widest italic">disponible</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINACIÓN */}
          <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white disabled:opacity-10 border border-white/5 active:scale-90 transition-all"><ChevronLeft size={18} /></button>
            <div className="flex gap-2 items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white disabled:opacity-10 border border-white/5 active:scale-90 transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* LISTADO DE COMBOS */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black uppercase text-orange-500 tracking-widest pl-4 flex items-center gap-2">
          <Sparkles size={14} /> Promociones Activas
        </h2>
        <div className="grid gap-3">
          {combos.map(c => (
            <div key={c.id} className="flex items-center bg-[#1A1612] p-3 rounded-[2rem] gap-3 border border-orange-500/10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/5 overflow-hidden flex-shrink-0">
                {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto h-full text-orange-500/10" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-orange-100 text-sm font-bold truncate uppercase italic tracking-tighter">{c.title}</h4>
                <p className="text-[10px] text-orange-500/70 font-black">${c.price}</p>
              </div>
              <button onClick={async () => { if(confirm('¿Borrar combo?')) { await supabase.from('combos').delete().eq('id', c.id); fetchData(); } }} className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full active:scale-90"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}