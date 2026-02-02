'use client';
import { LayoutGrid, Utensils, Zap, Clock, QrCode, Edit3 } from 'lucide-react';

interface AdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminNav({ activeTab, setActiveTab }: AdminNavProps) {
  const menuItems = [
    { id: 'quick', label: 'Stock', icon: Edit3, color: 'text-orange-500' },
    { id: 'products', label: 'Productos', icon: Utensils, color: 'text-emerald-500' },
    { id: 'combos', label: 'Combos', icon: Zap, color: 'text-yellow-500' },
    { id: 'categories', label: 'Categorías', icon: LayoutGrid, color: 'text-blue-500' },
    { id: 'schedules', label: 'Horarios', icon: Clock, color: 'text-purple-500' },
    { id: 'qr', label: 'QR', icon: QrCode, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-10">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border transition-all active:scale-95 ${
            activeTab === item.id 
            ? 'bg-white/10 border-white/20 shadow-lg' 
            : 'bg-[#111] border-white/5 grayscale'
          }`}
        >
          <item.icon className={`${activeTab === item.id ? item.color : 'text-gray-600'} mb-2`} size={20} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}