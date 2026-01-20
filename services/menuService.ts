import { supabase } from '@/lib/supabase';

export const fetchMenuData = async () => {
  const [catRes, prodRes, combRes, schedRes] = await Promise.all([
    supabase.from('categories').select('*').order('order', { ascending: true }),
    supabase.from('products').select('*, categories(name)'),
    supabase.from('combos').select('*').eq('active', true),
    supabase.from('schedules').select('*')
  ]);

  if (catRes.error || prodRes.error || combRes.error || schedRes.error) {
    throw new Error('Error al cargar los datos del menú');
  }

  return {
    categories: catRes.data || [],
    products: prodRes.data || [],
    combos: combRes.data || [],
    schedules: schedRes.data || []
  };
};