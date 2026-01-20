'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, MapPin, Wallet, Clock, X, Copy, CheckCircle2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<'payment' | 'hours' | 'location' | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Carga de horarios y cálculo de estado En Línea
  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await supabase.from('schedules').select('*').order('day_of_week');
      if (data) {
        setSchedules(data);
        checkOnlineStatus(data);
      }
    };
    fetchSchedules();
  }, []);

  const checkOnlineStatus = (scheds: any[]) => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const today = scheds.find(s => s.day_of_week === currentDay);

    if (today) {
      const open = parseInt(today.open_time.replace(':', ''));
      const close = parseInt(today.close_time.replace(':', ''));
      setIsOnline(currentTime >= open && currentTime <= close);
    }
  };

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const aliasMP = "RUBEN.PIZZAS.MP";
  const direccionRuben = "Calle Cardenal Zamore 939, San Martín, Mendoza";
  // Enlace codificado para Google Maps con la dirección exacta
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionRuben)}`;

  const copyAlias = () => {
    navigator.clipboard.writeText(aliasMP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-6">
        <div className="mx-auto bg-black/90 backdrop-blur-xl flex justify-between items-center shadow-2xl border-t border-white/10 w-full px-4 py-2 md:max-w-md md:rounded-[2.5rem] md:border md:p-2">
          
          {/* BOTÓN SOPORTE: Con indicador En Línea */}
          <a 
            href="https://wa.me/5492634325471?text=Hola Rubén! Tengo una consulta..." 
            target="_blank" 
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-[#25D366] transition-colors relative"
          >
            <div className="relative">
              <MessageCircle size={20} />
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-black ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Soporte</span>
          </a>
          
          <button onClick={() => setActiveModal('location')} className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-blue-400 transition-colors">
            <MapPin size={20} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Ubicación</span>
          </button>

          <button onClick={() => setActiveModal('payment')} className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-blue-400 transition-colors">
            <Wallet size={20} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Pagar</span>
          </button>

          <button onClick={() => setActiveModal('hours')} className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-orange-400 transition-colors">
            <Clock size={20} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Horarios</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 md:p-8 relative text-black"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>

              {activeModal === 'location' && (
                <div className="text-center pt-4">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
                    <MapPin size={28} />
                  </div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">Nuestra Ubicación</h3>
                  <p className="text-[11px] font-bold text-gray-500 mb-6 leading-relaxed px-4">
                    {direccionRuben}
                  </p>
                  
                  <a 
                    href={googleMapsUrl} 
                    target="_blank"
                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Navigation size={16} /> Abrir en Google Maps
                  </a>
                </div>
              )}

              {activeModal === 'payment' && (
                <div className="text-center pt-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">Mercado Pago</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Copiá el alias para pagar</p>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-6 border border-gray-100">
                    <span className="font-black text-xs italic truncate mr-2 tracking-tight">{aliasMP}</span>
                    <button onClick={copyAlias} className="text-blue-600 shrink-0">
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold leading-relaxed px-2 uppercase tracking-tight">
                    Una vez realizada la transferencia, enviá el comprobante por WhatsApp.
                  </p>
                </div>
              )}

              {activeModal === 'hours' && (
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}