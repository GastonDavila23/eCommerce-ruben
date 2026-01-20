'use client';
export default function HoursModal({ schedules }: { schedules: any[] }) {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  return (
    <div className="pt-2">
      <h3 className="text-lg font-black italic uppercase tracking-tighter mb-5">Nuestros Horarios</h3>
      <div className="space-y-2.5">
        {schedules.map((s, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="font-black text-gray-400 uppercase text-[9px] tracking-widest w-16">
              {days[s.day_of_week]}
            </span>
            <div className="h-[1px] bg-gray-100 flex-1 mx-3"></div>
            <span className="font-black italic text-[11px] tracking-tight text-gray-700">
              {s.open_time.slice(0, 5)} — {s.close_time.slice(0, 5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}