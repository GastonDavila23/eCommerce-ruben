'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CalendarDays, Clock, Check, Pencil } from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Lunes' }, { id: 2, name: 'Martes' }, { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' }, { id: 5, name: 'Viernes' }, { id: 6, name: 'Sábado' }, { id: 0, name: 'Domingo' }
];

export default function ScheduleForm() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Referencias para los inputs para poder cambiar sus valores programáticamente
  const openRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    fetchSchedules(); 
  }, []);

  // Cada vez que cambia el día seleccionado, buscamos si ya existe un horario
  useEffect(() => {
    const existing = schedules.find(s => s.day_of_week === selectedDay);
    if (existing && openRef.current && closeRef.current) {
      openRef.current.value = existing.open_time.slice(0, 5);
      closeRef.current.value = existing.close_time.slice(0, 5);
    } else if (openRef.current && closeRef.current) {
      // Si no existe, limpiamos los inputs
      openRef.current.value = "";
      closeRef.current.value = "";
    }
  }, [selectedDay, schedules]);

  const fetchSchedules = async () => {
    const { data } = await supabase.from('schedules').select('*').order('day_of_week');
    setSchedules(data || []);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const dayData = DAYS.find(d => d.id === selectedDay);

    const { error } = await supabase.from('schedules').upsert({
      day_of_week: selectedDay,
      day_name: dayData?.name,
      open_time: openRef.current?.value,
      close_time: closeRef.current?.value,
    }, { onConflict: 'day_of_week' });

    if (!error) {
      await fetchSchedules();
      alert(`Horario de ${dayData?.name} actualizado correctamente ⏰`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
      <h3 className="text-green-400 text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2">
        <CalendarDays size={14} /> Gestión de Horarios
      </h3>

      <form onSubmit={handleUpdate} className="space-y-8 mb-10">
        {/* Selector de Días */}
        <div className="space-y-3">
          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">
            1. Seleccioná el día a modificar
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {DAYS.map((day) => {
              const hasSchedule = schedules.some(s => s.day_of_week === day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-bold transition-all border whitespace-nowrap flex items-center gap-2 ${
                    selectedDay === day.id 
                      ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/20' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {day.name}
                  {hasSchedule && <div className={`w-1 h-1 rounded-full ${selectedDay === day.id ? 'bg-white' : 'bg-green-500'}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs de Tiempo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Apertura</label>
            <input 
              ref={openRef}
              type="time" 
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm text-white border-none outline-none focus:ring-1 focus:ring-green-500/50 transition-all" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Cierre</label>
            <input 
              ref={closeRef}
              type="time" 
              className="w-full bg-white/5 rounded-2xl px-6 py-4 text-sm text-white border-none outline-none focus:ring-1 focus:ring-green-500/50 transition-all" 
              required 
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? 'Procesando...' : (
            schedules.some(s => s.day_of_week === selectedDay) 
            ? <><Pencil size={16}/> Actualizar Horario</> 
            : <><Check size={16}/> Guardar Horario</>
          )}
        </button>
      </form>

      {/* Listado Visual */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Horarios establecidos</label>
        <div className="grid gap-2">
          {schedules.map(s => (
            <button 
              key={s.id} 
              onClick={() => setSelectedDay(s.day_of_week)}
              className="w-full flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-green-500/50 transition-all group"
            >
              <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-green-500 transition-colors">
                {s.day_name}
              </span>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-green-500" />
                <span className="text-white text-[11px] font-black tracking-tight">
                  {s.open_time.slice(0,5)} — {s.close_time.slice(0,5)} HS
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}