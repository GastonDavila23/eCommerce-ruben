'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HeaderProps {
  isOpen: boolean;
  categories: any[];
  filter: string | null;
  setFilter: (id: string | null) => void;
}

export default function Header({ isOpen, categories, filter, setFilter }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const VISIBLE_LIMIT = 8;
  const hasMore = categories.length > VISIBLE_LIMIT;

  const displayedCategories = isExpanded 
    ? categories 
    : categories.slice(0, VISIBLE_LIMIT);

  return (
    <header className="sticky top-0 bg-white backdrop-blur-3xl z-40 px-6 pt-4 pb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-black italic leading-none text-app-fg pl-1 tracking-[0.2em]">
          RW-CARTA
        </h1>
        
        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
          isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          <div className="relative flex h-2 w-2">
            <span className={`rounded-full h-2 w-2 ${isOpen ? 'bg-green-600' : 'bg-red-600'}`} />
            {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
      </div>

      {/* Grilla de Filtros */}
      <div className="grid grid-cols-3 gap-2 transition-all duration-500">
        <button
          onClick={() => setFilter(null)}
          className={`py-3 px-2 rounded-full text-[12px] font-black uppercase tracking-widest leading-tight break-words ${
            !filter ? 'bg-app-fg text-white' : 'bg-app-bg text-gray-400'
          }`}
        >
          Todos
        </button>

        {displayedCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`py-3 px-2 rounded-full text-[12px] font-black uppercase tracking-widest leading-tight break-words ${
              filter === cat.id ? 'bg-app-fg text-white' : 'bg-app-bg text-gray-400'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Botón Ver Más / Menos */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="py-3 px-2 rounded-full text-[12px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            {isExpanded ? (
              <>Menos <ChevronUp size={12} /></>
            ) : (
              <>Más <ChevronDown size={12} /></>
            )}
          </button>
        )}
      </div>
    </header>
  );
}