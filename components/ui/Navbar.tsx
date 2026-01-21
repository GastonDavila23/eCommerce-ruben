'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuData } from '@/services/menuService';
import { checkBusinessStatus } from '@/utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MapPin, Wallet, Clock, X } from 'lucide-react';
import LocationModal from './modals/LocationModal';
import PaymentModal from './modals/PaymentModal';
import HoursModal from './modals/HoursModal';
import SupportModal from './modals/SupportModal';

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<'payment' | 'hours' | 'location' | 'support' | null>(null);

  const { data } = useQuery({ 
    queryKey: ['menuData'], 
    queryFn: fetchMenuData 
  });
  
  const isOnline = data ? checkBusinessStatus(data.schedules) : false;

  const navItems = [
    { id: 'support', label: 'Soporte', icon: MessageCircle, color: 'hover:text-[#25D366]' },
    { id: 'location', label: 'Ubicación', icon: MapPin, color: 'hover:text-blue-400' },
    { id: 'payment', label: 'Pagar', icon: Wallet, color: 'hover:text-blue-400' },
    { id: 'hours', label: 'Horarios', icon: Clock, color: 'hover:text-orange-400' },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'support' && isOnline) {
      window.open("https://wa.me/5492634325471?text=Hola Rubén! Tengo una consulta...", '_blank');
      return;
    }
    setActiveModal(id as any);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-6">
        <div className="mx-auto bg-black/90 backdrop-blur-xl flex justify-between items-center shadow-2xl border-t border-white/10 w-full px-4 py-2 md:max-w-md md:rounded-[2.5rem] md:border md:p-2">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleItemClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-gray-400 ${item.color} transition-colors relative`}
            >
              <div className="relative">
                <item.icon size={20} />
                {item.id === 'support' && (
                  <>
                    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black z-10 ${
                      isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    {isOnline && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                    )}
                  </>
                )}
              </div>
              <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setActiveModal(null)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 md:p-8 relative text-black shadow-2xl z-10"
            >
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
              
              {activeModal === 'location' && <LocationModal />}
              {activeModal === 'payment' && <PaymentModal />}
              {activeModal === 'hours' && <HoursModal schedules={data?.schedules || []} />}
              {activeModal === 'support' && <SupportModal isOnline={isOnline} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}