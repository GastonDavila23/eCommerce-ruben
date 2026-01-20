'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, MapPin, Wallet, Clock, X, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<'payment' | 'hours' | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await supabase.from('schedules').select('*').order('day_of_week');
      if (data) setSchedules(data);
    };
    fetchSchedules();
  }, []);

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const aliasMP = "RUBEN.PIZZAS.MP";

  const copyAlias = () => {
    navigator.clipboard.writeText(aliasMP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-6">
        <div className="mx-auto bg-black/90 backdrop-blur-xl flex justify-between items-center shadow-2xl border-t border-white/10 w-full px-4 py-2 md:max-w-md md:rounded-[2.5rem] md:border md:p-2">
          <a href="https://wa.me/5492616948318?text=Hola Rubén! Tengo una consulta..." target="_blank" className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-[#25D366] transition-colors">
            <MessageCircle size={20} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Soporte</span>
          </a>
          <a href="https://maps.app.goo.gl/tu-link-aqui" target="_blank" className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-blue-400 transition-colors">
            <MapPin size={20} />
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Ubicación</span>
          </a>
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
              {/* Botón Cerrar más pequeño y mejor ubicado */}
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>

              {activeModal === 'payment' && (
                <div className="text-center pt-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">Mercado Pago</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">Copiá el alias para pagar</p>
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