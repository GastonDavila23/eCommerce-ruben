'use client';
import { useState } from 'react';
import ProductForm from '@/app/admin/secret/components/ProductForm';
import CategoryForm from '@/app/admin/secret/components/CategoryForm';
import ComboForm from '@/app/admin/secret/components/ComboForm';
import ScheduleForm from '@/app/admin/secret/components/ScheduleForm';
import QRGenerator from './components/QRGenerator';
import AdminNav from './components/AdminNav';
import AdminHeader from './components/AdminHeader';

export default function AdminSecreto() {
  const [activeSection, setActiveSection] = useState('products');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 pb-32 font-sans">
      <div className="max-w-2xl mx-auto">
        <AdminHeader />

        {/* CONTENIDO DINÁMICO */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeSection === 'qr' && (
            <SectionWrapper title="Generador de QR" color="text-red-500"><QRGenerator /></SectionWrapper>
          )}
          {activeSection === 'categories' && (
            <SectionWrapper title="Categorías" color="text-blue-500"><CategoryForm /></SectionWrapper>
          )}
          {activeSection === 'products' && (
            <SectionWrapper title="Productos" color="text-emerald-500"><ProductForm /></SectionWrapper>
          )}
          {activeSection === 'combos' && (
            <SectionWrapper title="Combos" color="text-orange-500"><ComboForm /></SectionWrapper>
          )}
          {activeSection === 'schedule' && (
            <SectionWrapper title="Horarios" color="text-purple-500"><ScheduleForm /></SectionWrapper>
          )}
        </main>

        {/* Componente Modular de Navegación */}
        <AdminNav activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
    </div>
  );
}

// Helper para mantener los títulos de sección consistentes
function SectionWrapper({ children, title, color }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px bg-white/5 flex-1"></div>
        <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>{title}</h2>
        <div className="h-px bg-white/5 flex-1"></div>
      </div>
      {children}
    </div>
  );
}