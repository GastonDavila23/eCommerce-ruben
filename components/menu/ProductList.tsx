'use client';
import { useMemo, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '../ui/QuantitySelector';
import ProductModal from './ProductModal';

export default function ProductList({ categories, products, combos, isOpenBusiness, filter }: any) {
  const { cart, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const comboCategoryId = useMemo(() => {
    return categories.find((c: any) => 
      c.name.toLowerCase().includes('combo') || c.name.toLowerCase().includes('promo')
    )?.id;
  }, [categories]);

  const displayCategories = useMemo(() => {
    const allCats = [...categories];
    const hasCombos = combos && combos.length > 0;
    const shouldShowVirtual = hasCombos && (!filter || filter === comboCategoryId || filter === 'virtual-combos');

    let result = allCats;
    if (filter) {
      result = allCats.filter((c: any) => c.id === filter);
    }

    if (shouldShowVirtual && !result.find(c => c.is_virtual)) {
      result = [{ id: 'virtual-combos', name: 'Promociones Imperdibles', is_virtual: true }, ...result];
    }

    return result;
  }, [categories, combos, filter, comboCategoryId]);

  return (
    <div className="space-y-10 pb-32 w-full max-w-full overflow-x-hidden">
      {displayCategories.map((category: any) => {
        const items = category.is_virtual 
          ? combos.map((c: any) => ({ ...c, name: c.title, is_combo: true })) 
          : products.filter((p: any) => p.category_id === category.id);

        if (items.length === 0) return null;

        return (
          <section key={category.id} className="scroll-mt-24 w-full">
            <h2 className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-4 pl-2 flex items-center gap-2">
              {category.is_virtual && <span className="text-lg"></span>} {category.name}
            </h2>

            <div className="grid gap-3 w-full">
              {items.map((item: any) => {
                const cartItem = cart.find((i: any) => i.id === item.id);
                const isInCart = !!cartItem;
                const isAvailable = item.is_available !== false;

                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-[1.5rem] border shadow-sm w-full transition-all ${
                      category.is_virtual ? 'bg-orange-50/50 border-orange-100' : 'bg-white border-gray-100'
                    }`}
                  >
                    {/* IMAGEN: Ahora abre el modal al tocarla */}
                    <div 
                      onClick={() => setSelectedProduct(item)} // Disparador del modal
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-50 cursor-pointer active:scale-95 transition-transform"
                    >
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>

                    {/* Resto del contenido igual... */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-xs sm:text-[13px] uppercase italic tracking-tighter leading-tight truncate">
                        {item.name}
                      </h3>
                      <p className="text-black font-black text-xs sm:text-sm mt-0.5">${item.price}</p>
                    </div>

                    <div className="flex-shrink-0 w-24 sm:w-28 flex justify-end">
                      {!isInCart ? (
                        <button
                          onClick={() => isAvailable && isOpenBusiness && addToCart(item)}
                          disabled={!isOpenBusiness || !isAvailable}
                          className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                            !isAvailable || !isOpenBusiness 
                              ? 'bg-gray-100 text-gray-400' 
                              : category.is_virtual ? 'bg-orange-600 text-white' : 'bg-black text-white'
                          }`}
                        >
                          {!isAvailable ? 'Agotado' : 'Comprar'}
                        </button>
                      ) : (
                        <div className="w-full">
                          <QuantitySelector product={item} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* RENDERIZADO DEL MODAL */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}