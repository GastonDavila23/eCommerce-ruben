import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSavingPrices, setIsSavingPrices] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: cat } = await supabase.from('categories').select('*').order('order', { ascending: true });
    const { data: prod } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
    const { data: comb } = await supabase.from('combos').select('*').order('created_at', { ascending: false });
    
    if (cat) setCategories(cat);
    if (prod) setProducts(prod);
    if (comb) setCombos(comb);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const upsertProduct = async (formData: any, selectedFile: File | null, editingId: string | null) => {
    setLoading(true);
    try {
      let image_url = formData.image_url;
      if (selectedFile) {
        const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1080 };
        const compressed = await imageCompression(selectedFile, options);
        const fileName = `${Date.now()}.jpg`;
        await supabase.storage.from('products').upload(fileName, compressed);
        image_url = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      const payload = { ...formData, price: parseFloat(formData.price), image_url };
      const { error } = editingId 
        ? await supabase.from('products').update(payload).eq('id', editingId)
        : await supabase.from('products').insert([payload]);

      if (error) throw error;
      await fetchData();
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBulkPrices = async (changes: Record<string, number>) => {
    setIsSavingPrices(true);
    try {
      const updates = Object.entries(changes).map(([id, price]) => 
        supabase.from('products').update({ price }).eq('id', id)
      );
      await Promise.all(updates);
      await fetchData();
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setIsSavingPrices(false);
    }
  };

  return {
    products, categories, combos, loading, isSavingPrices,
    upsertProduct, updateBulkPrices, fetchData
  };
}