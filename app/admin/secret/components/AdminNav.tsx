'use client';
import { QrCode, Layers, ShoppingBag, Sparkles, Clock } from 'lucide-react';

export default function AdminNav({ activeSection, setActiveSection }: any) {
  const menuItems = [
    { id: 'qr', label: 'QR', icon: QrCode, color: 'text-red-500', activeBg: 'bg-red-500/10' },
    { id: 'categories', label: 'Categorías', icon: Layers, color: 'text-blue-500', activeBg: 'bg-blue-500/10' },
    { id: 'products', label: 'Productos', icon: ShoppingBag, color: 'text-emerald-500', activeBg: 'bg-emerald-500/10' },
    { id: 'combos', label: 'Promos', icon: Sparkles, color: 'text-orange-500', activeBg: 'bg-orange-500/10' },
    { id: 'schedule', label: 'Horarios', icon: Clock, color: 'text-purple-500', activeBg: 'bg-purple-500/10' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-6">
      <div className="mx-auto bg-[#111]/90 backdrop-blur-2xl flex justify-around items-center shadow-2xl border-t border-white/10 w-full px-2 h-20 md:h-24 md:max-w-xl md:rounded-[2.5rem] md:border transition-none">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="flex-1 h-full flex flex-col items-center justify-center transition-none outline-none"
            >
              {/* Contenedor con tamaño fijo SIEMPRE, solo cambia el color de fondo */}
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200
                ${isActive ? item.activeBg : 'bg-transparent'}
              `}>
                <item.icon 
                  size={20} 
                  className={`transition-colors duration-200 ${isActive ? item.color : 'text-gray-600'}`} 
                />
              </div>
              
              {/* Texto con color sutil, sin cambios de tamaño ni peso */}
              <span className={`
                text-[7px] font-black uppercase mt-1 tracking-tighter transition-colors duration-200
                ${isActive ? 'text-white' : 'text-gray-700'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}