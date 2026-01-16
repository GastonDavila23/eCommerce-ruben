'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Verifica que esta ruta sea correcta
import { LayoutGrid, Plus, Trash2 } from 'lucide-react';

export default function CategoryForm() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    // 1. Obtener el valor del input por su atributo 'name'
    const nameValue = e.target.catName.value; 

    if (!nameValue) return;

    // 2. Insertar en la tabla 'categories' de Supabase
    const { error } = await supabase.from('categories').insert([{ name: nameValue }]);

    if (error) {
      console.error("Error al insertar:", error.message);
      alert("No se pudo guardar: " + error.message);
    } else {
      e.target.reset(); // Limpia el input
      fetchCategories(); // Recarga la lista
    }
  };

  return (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
      {/* 3. ¡IMPORTANTE! El onSubmit debe estar aquí */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input 
          name="catName"  // Este nombre debe coincidir con e.target.catName.value
          placeholder="Ej: Calzones" 
          className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm border-none outline-none text-white" 
          required 
        />
        <button 
          type="submit" // Asegúrate de que el botón sea tipo submit
          className="bg-blue-600 px-6 rounded-2xl font-black text-[10px] uppercase text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={20}/>
        </button>
      </form>

      {/* Listado de categorías existentes */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <div key={c.id} className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
            <span className="text-xs font-bold text-gray-200">{c.name}</span>
            <button onClick={async () => { await supabase.from('categories').delete().eq('id', c.id); fetchCategories(); }}>
              <Trash2 size={14} className="text-red-500 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}