'use client';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationModal() {
  const direccion = "Calle Cardenal Zamore 939, San Martín, Mendoza";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

  return (
    <div className="text-center pt-4">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
        <MapPin size={28} />
      </div>
      <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">Nuestra Ubicación</h3>
      <p className="text-[11px] font-bold text-gray-500 mb-6 leading-relaxed px-4">{direccion}</p>
      
      <a href={googleMapsUrl} target="_blank" className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
        <Navigation size={16} /> Abrir en Google Maps
      </a>
    </div>
  );
}