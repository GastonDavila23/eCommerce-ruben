'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutGrid, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
// Importaciones para el Drag and Drop
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sub-componente para cada item de la lista ---
function SortableItem({ id, category, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/5 px-4 py-3 rounded-xl flex items-center justify-between border border-white/5 mb-2 touch-none"
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Este icono es el que Rubén mantiene apretado para mover */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-white/20 hover:text-white transition-colors">
          <GripVertical size={18} />
        </div>
        <span className="text-xs font-bold text-gray-200">{category.name}</span>
      </div>

      <button
        onClick={() => onDelete(id)}
        className="p-2 text-red-500/50 hover:text-red-500 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// --- Componente Principal ---
export default function CategoryForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [moving, setMoving] = useState(false);

  // Configuración de sensores para que funcione en PC y Celular
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('order', { ascending: true });
    setCategories(data || []);
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const name = e.target.catName.value;
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 0;
    await supabase.from('categories').insert([{ name, order: nextOrder }]);
    e.target.reset();
    fetchCategories();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newOrder = arrayMove(categories, oldIndex, newIndex);

      // 1. Actualizamos el estado local inmediatamente (Feedback visual)
      setCategories(newOrder);
      setMoving(true);

      try {
        // 2. Preparamos los datos para Supabase. 
        // Importante: Mandamos solo ID y el nuevo ORDER.
        const updates = newOrder.map((cat, i) => ({
          id: cat.id,
          order: i, // El nuevo índice
          name: cat.name // Incluimos el nombre por si la tabla lo requiere como obligatorio
        }));

        // 3. Usamos upsert. En Supabase, el upsert basado en el 'id' reemplaza la fila.
        const { error } = await supabase
          .from('categories')
          .upsert(updates, { onConflict: 'id' });

        if (error) throw error;

        console.log("Orden guardado correctamente");
      } catch (err) {
        console.error("Error al guardar el orden:", err);
        // Si falla, volvemos a traer los datos de la DB para no mentirle al usuario
        fetchCategories();
      } finally {
        setMoving(false);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm('¿Borrar categoría?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
      <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
        <LayoutGrid size={14} /> Ordenar Categorías (Arrastrá)
      </h3>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input name="catName" placeholder="Nueva Categoría..." className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm border-none outline-none text-white" required />
        <button type="submit" className="bg-blue-600 px-6 rounded-2xl font-black text-[10px] uppercase text-white"><Plus size={20} /></button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {categories.map((c) => (
            <SortableItem key={c.id} id={c.id} category={c} onDelete={deleteCategory} />
          ))}
        </SortableContext>
      </DndContext>

      {moving && (
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Loader2 size={12} className="animate-spin" /> Sincronizando orden...
        </div>
      )}
    </div>
  );
}