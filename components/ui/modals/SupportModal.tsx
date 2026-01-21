'use client';
import { Clock, Send, MessageCircle } from 'lucide-react';

export default function SupportModal({ isOnline }: { isOnline: boolean }) {
  const phone = "5492634325471";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent("Hola Rubén! Tengo una consulta...")}`;

  return (
    <div className="text-center pt-4">
      {/* Icono dinámico según estado */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
        isOnline ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
      }`}>
        {isOnline ? <MessageCircle size={28} /> : <Clock size={28} />}
      </div>

      <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">
        {isOnline ? 'Soporte en línea' : 'Fuera de Horario'}
      </h3>

      <p className="text-[11px] font-bold text-gray-500 mb-6 leading-relaxed px-4">
        {isOnline 
          ? "Rubén está listo para ayudarte. Enviale un mensaje y te responderá en breve."
          : "Rubén no está disponible ahora, pero podés dejarle un mensaje por WhatsApp y te responderá apenas abra el local."
        }
      </p>
      
      <a 
        href={whatsappUrl} 
        target="_blank"
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
          isOnline ? 'bg-[#25D366] text-white' : 'bg-black text-white'
        }`}
      >
        <Send size={16} /> 
        {isOnline ? 'Chatear con Rubén' : 'Enviar mensaje de todos modos'}
      </a>
    </div>
  );
}