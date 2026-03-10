'use client';
import { useState, useMemo } from 'react';
import { List, Search, ImageIcon, Pencil, Trash2, ChevronLeft, ChevronRight, Save, Loader2, PackageCheck, Eye, EyeOff, PackageX } from 'lucide-react';

export default function InventoryTable({ products, onEdit, onDelete, onSavePrices, isSavingPrices, onToggleStatus }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingPriceChanges, setPendingPriceChanges] = useState<Record<string, number>>({});
  const ROWS_PER_PAGE = 8;

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ROWS_PER_PAGE) || 1;

  const currentProducts = useMemo(() => {
    const firstIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredProducts.slice(firstIndex, firstIndex + ROWS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const emptyRows = ROWS_PER_PAGE - currentProducts.length;

  return (
    <div className="space-y-4">
      {Object.keys(pendingPriceChanges).length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
          <button 
            onClick={() => { onSavePrices(pendingPriceChanges); setPendingPriceChanges({}); }} 
            disabled={isSavingPrices} 
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3 border border-orange-400"
          >
            {isSavingPrices ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Guardar {Object.keys(pendingPriceChanges).length} cambios</>}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List size={16} className="text-gray-500" />
            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Gestión de Stock</h2>
          </div>
          <span className="text-[9px] font-black text-gray-600 italic">Pág {currentPage} de {totalPages}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            placeholder="Buscar por nombre..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 text-xs text-white outline-none focus:border-blue-500/30 transition-all" 
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1rem] border border-white/5 bg-[#141414] shadow-2xl">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 uppercase text-[9px] text-gray-600 font-black tracking-widest">
              <th className="p-3 w-14">Img</th>
              <th className="p-3 w-40">Producto</th>
              {/* <th className="p-3 w-10 text-center">Stock</th>
              <th className="p-3 w-10 text-center">Ver</th> */}
              <th className="p-3 w-14">Precio</th>
              <th className="p-3 w-28 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>

            {currentProducts.map((p: any) => (

              // Cabecera de la tabla de stock
              <tr key={p.id} className={`border-b border-white/5 h-[64px] transition-all duration-300 ${!p.is_active ? 'opacity-40 grayscale-[0.5]' : ''}`}>

                {/* Columna de imagen del producto */}
                <td className="p-2 w-14">
                  <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-white/10" />}
                  </div>
                </td>

                {/* Columna de nombre del producto y categoría */}
                <td className="w-40">
                  <div className="flex flex-col truncate">
                    <span className="text-white font-bold text-[12px] truncate uppercase italic">{p.name}</span>
                    <span className="text-[8px] text-gray-500 font-black uppercase truncate">{p.categories?.name}</span>
                  </div>
                </td>

                {/*  
                <td className="p-2 w-14 text-center">
                  <button
                    onClick={() => onToggleStatus(p.id, 'is_available', !p.is_available)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-75 ${
                      p.is_available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {p.is_available ? <PackageCheck size={16} /> : <PackageX size={16} />}
                  </button>
                </td>

                
                <td className="p-2 w-14 text-center">
                  <button onClick={() => onToggleStatus(p.id, 'is_active', !p.is_active)} className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-75 ${p.is_active ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-700/20 text-gray-600'}`}>{p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                </td>
                */}

                {/* Columna de precio editable */}
                <td className="p-2 w-14">
                  <input 
                    type="number" 
                    defaultValue={p.price} 
                    onChange={(e) => setPendingPriceChanges(prev => ({...prev, [p.id]: parseFloat(e.target.value)}))} 
                    className={`w-full bg-white/5 border rounded-lg py-1 px-2 text-[12px] font-black italic outline-none transition-all ${pendingPriceChanges[p.id] ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-white'}`} 
                  />
                </td>

                {/* Columna de acciones: Editar y Eliminar */}
                <td className="p-2 w-40 text-right pr-5">
                  <div className="flex justify-end gap-2">

                    {/* invisible */}
                    <button 
                      onClick={() => onToggleStatus(p.id, 'is_active', !p.is_active)} 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-75 ${p.is_active ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-700/20 text-gray-600'}`}>{p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    {/* sin stock */}
                    <button 
                      onClick={() => onToggleStatus(p.id, 'is_available', !p.is_available)} 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-75 ${p.is_available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{p.is_available ? <PackageCheck size={16} /> : <PackageX size={16} />}
                    </button>
                    
                    {/* editar */}
                    <button 
                      onClick={() => onEdit(p)} 
                      className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto bg-orange-500/10 text-orange-500 transition-all active:scale-75"><Pencil size={12}/>
                    </button>

                    {/* borrar */}
                    <button 
                      onClick={() => onDelete(p.id)} 
                      className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto bg-red-500/10 text-red-500 transition-all active:scale-75"><Trash2 size={12}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Espacio libre en la tabla de stock */}
            {Array.from({ length: emptyRows }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="h-[64px] border-b border-white/[0.02] opacity-5">
                <td colSpan={5} className="text-center text-[8px] text-gray-600 uppercase italic">Espacio Libre</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 bg-white/5 flex items-center justify-between border-t border-white/5">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white disabled:opacity-10 active:scale-90 transition-all"><ChevronLeft size={18} /></button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white disabled:opacity-10 active:scale-90 transition-all"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}