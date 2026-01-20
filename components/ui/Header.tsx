'use client';

interface HeaderProps {
  isOpen: boolean;
  categories: any[];
  filter: string | null;
  setFilter: (id: string | null) => void;
}

export default function Header({ isOpen, categories, filter, setFilter }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 px-6 pt-10 pb-4 border-b border-gray-50">
      <div className="flex justify-between items-center mb-6">
        {/* Título */}
        <h1 className="text-4xl font-black italic tracking-tighter leading-none text-black">
          RW-CARTA
        </h1>
        {/* Badge de Estado */}
        <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
          <div className="relative flex h-2 w-2">
            <span className={`rounded-full h-2 w-2 ${isOpen ? 'bg-green-600' : 'bg-red-600'
              }`} />
            {isOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            )}
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest">
            {isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
      </div>

      {/* Barra de Filtros Horizontal */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilter(null)}
          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!filter
              ? 'bg-black text-white border-black shadow-lg shadow-black/20'
              : 'bg-gray-50 text-gray-400 border-transparent'
            }`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filter === cat.id
                ? 'bg-black text-white border-black'
                : 'bg-gray-50 text-gray-400 border-transparent'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </header>
  );
}