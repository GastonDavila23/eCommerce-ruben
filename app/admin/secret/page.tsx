'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '@/app/admin/secret/components/ProductForm';
import CategoryForm from '@/app/admin/secret/components/CategoryForm';
import ComboForm from '@/app/admin/secret/components/ComboForm';
import ScheduleForm from '@/app/admin/secret/components/ScheduleForm';
import QRGenerator from '@/app/admin/secret/components/QRGenerator';
import QuickEditTable from '@/app/admin/secret/components/QuickEditTable';
import AdminNav from './components/AdminNav';

export default function AdminSecreto() {
  // Pestaña inicial por defecto: la edición rápida de stock
  const [activeTab, setActiveTab] = useState('quick');

  const renderContent = () => {
    switch (activeTab) {
      case 'quick': return <QuickEditTable />;
      case 'products': return <ProductForm />;
      case 'categories': return <CategoryForm />;
      case 'combos': return <ComboForm />;
      case 'schedules': return <ScheduleForm />;
      case 'qr': return <QRGenerator />;
      default: return <QuickEditTable />;
    }
  };

  const getTabTitle = () => {
    const titles: Record<string, { t: string, c: string }> = {
      quick: { t: 'Edición de Stock', c: 'text-orange-500' },
      products: { t: 'Gestión de Productos', c: 'text-emerald-500' },
      categories: { t: 'Categorías de Menú', c: 'text-blue-500' },
      combos: { t: 'Combos Slider', c: 'text-yellow-500' },
      schedules: { t: 'Disponibilidad', c: 'text-purple-500' },
      qr: { t: 'QR & Enlaces', c: 'text-red-500' }
    };
    return titles[activeTab];
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pb-24 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10 pt-4 text-center">
          <h1 className="text-4xl text-red-500 font-black italic tracking-tighter">ADMINISTRAR CARTA</h1>
        </header>

        {/* Menú Modular */}
        <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Área de Contenido Dinámico con Transición Suave */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-white/5 flex-1"></div>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${getTabTitle().c}`}>
              {getTabTitle().t}
            </h2>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}