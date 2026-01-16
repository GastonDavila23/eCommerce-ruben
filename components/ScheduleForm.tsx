'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CalendarDays, Clock } from 'lucide-react';

export default function ScheduleForm() {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    const { data } = await supabase.from('schedules').select('*').order('day_of_week');
    setSchedules(data || []);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    await supabase.from('schedules').upsert({
      day_of_week: parseInt(form.day.value),
      day_name: form.day.selectedOptions[0].text,
      open_time: form.open.value,
      close_time: form.close.value,
    }, { onConflict: 'day_of_week' });
    fetchSchedules();
    alert("Horario actualizado ⏰");
  };

  return (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
      <h3 className="text-green-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
        <CalendarDays size={14} /> Horarios de Atención
      </h3>
      <form onSubmit={handleUpdate} className="space-y-4 mb-8">
        <select name="day" className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm border-none outline-none">
          <option value="1">Lunes</option><option value="2">Martes</option><option value="3">Miércoles</option>
          <option value="4">Jueves</option><option value="5">Viernes</option><option value="6">Sábado</option><option value="0">Domingo</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input name="open" type="time" className="bg-white/5 rounded-2xl px-6 py-4 text-sm border-none outline-none" required />
          <input name="close" type="time" className="bg-white/5 rounded-2xl px-6 py-4 text-sm border-none outline-none" required />
        </div>
        <button className="w-full bg-green-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">GUARDAR HORARIO</button>
      </form>
      <div className="space-y-2">
        {schedules.map(s => (
          <div key={s.id} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-tighter">
            <span className="text-gray-400">{s.day_name}</span>
            <span className="text-white">{s.open_time.slice(0,5)} - {s.close_time.slice(0,5)} HS</span>
          </div>
        ))}
      </div>
    </div>
  );
}