'use client';
import ProductForm from '@/components/ProductForm';
import CategoryForm from '@/components/CategoryForm';
import ComboForm from '@/components/ComboForm';
import ScheduleForm from '@/components/ScheduleForm';

export default function AdminSecreto() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pb-24 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10 pt-4 text-center">
          <h1 className="text-4xl font-black italic tracking-tighter">RUBÉN ADMIN 🤫</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            Gestión Integral de la Carta
          </p>
        </header>

        <div className="space-y-16">
          {/* Sección 1: Categorías */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-800 flex-1"></div>
              <h2 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Categorías</h2>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <CategoryForm />
          </section>

          {/* Sección 2: Productos Individuales */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-800 flex-1"></div>
              <h2 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Productos</h2>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <ProductForm />
          </section>

          {/* Sección 3: Combos Imperdibles */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-800 flex-1"></div>
              <h2 className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">Combos Slider</h2>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <ComboForm />
          </section>

          {/* Sección 4: Horarios */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-800 flex-1"></div>
              <h2 className="text-[10px] font-black uppercase text-purple-500 tracking-[0.2em]">Disponibilidad</h2>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>
            <ScheduleForm />
          </section>
        </div>
      </div>
    </div>
  );
}