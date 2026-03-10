'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductFormEditor from './ProductFormEditor';
import InventoryTable from './InventoryTable';
import { supabase } from '@/lib/supabase';

export default function ProductForm() {
  const { products, categories, combos, loading, isSavingPrices, upsertProduct, updateBulkPrices, fetchData } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    ingredients: [] as string[]
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category_id && !editingId) {
      setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, formData.category_id, editingId]);

  const handleToggleStatus = async (id: string, field: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: newStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('No se pudo cambiar el estado del producto');
    }
  };

  const handleEditInit = (p: any) => {
    setEditingId(p.id);
    setSelectedFile(null);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      category_id: p.category_id,
      image_url: p.image_url || '',
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : []
    });
  };

  const handleFormSubmit = async (e: any, file: File | null) => {
    if (e && e.preventDefault) e.preventDefault();

    const success = await upsertProduct(formData, file, editingId);

    if (success) {
      setEditingId(null);
      setSelectedFile(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories[0]?.id || '',
        image_url: '',
        ingredients: []
      });
      alert(editingId ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
    } else {
      alert('Hubo un error al guardar el producto. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 pb-32">
      <ProductFormEditor
        formData={formData}
        setFormData={setFormData}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        categories={categories}
        loading={loading}
        editingId={editingId}
        onSubmit={handleFormSubmit}
        onReset={() => {
          setEditingId(null);
          setFormData({
            name: '',
            description: '',
            price: '',
            category_id: categories[0]?.id || '',
            image_url: '',
            ingredients: []
          });
        }}
      />

      <InventoryTable
        products={products}
        isSavingPrices={isSavingPrices}
        onEdit={handleEditInit}
        onDelete={async (id: string) => {
          if (confirm('¿Seguro que quieres eliminar este producto permanentemente?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
              alert('No se pudo eliminar el producto');
            } else {
              fetchData();
            }
          }
        }}
        onSavePrices={updateBulkPrices}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}