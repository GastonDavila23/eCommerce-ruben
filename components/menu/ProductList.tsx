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
    if (filter) result = allCats.filter((c: any) => c.id === filter);
    if (shouldShowVirtual && !result.find(c => c.is_virtual)) {
      result = [{ id: 'virtual-combos', name: 'Promociones Imperdibles', is_virtual: true }, ...result];
    }
    return result;
  }, [categories, combos, filter, comboCategoryId]);

  return (
    <div className="space-y-8 pb-32 w-full max-w-full overflow-x-hidden px-1">
      {displayCategories.map((category: any) => {
        // REFACTORIZACIÓN: Filtramos para que solo aparezcan items con is_active === true
        const rawItems = category.is_virtual
          ? combos.map((c: any) => ({ ...c, name: c.title, is_combo: true }))
          : products.filter((p: any) => p.category_id === category.id);

        // Se filtran los productos desactivados aquí
        const items = rawItems.filter((item: any) => item.is_active !== false);

        if (items.length === 0) return null;

        return (
          <section key={category.id} className="scroll-mt-24 w-full">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-3 pl-3 flex items-center gap-2">
              {category.name}
            </h2>

            {/* CONTENEDOR DE TABLA REAL */}
            <div className="overflow-hidden bg-red-500">
              <table className="w-full border-collapse table-fixed">
                <tbody>
                  {items.map((item: any, idx: number) => {
                    const cartItem = cart.find((i: any) => i.id === item.id);
                    const isInCart = !!cartItem;
                    // Mantenemos isAvailable para el botón (ej. stock temporal)
                    const isAvailable = item.is_available !== false;

                    return (
                      <tr
                        key={item.id}
                        className={`bg-white h-[120px] border-b-2 border-gray-50 last:border-0 active:bg-gray-50 transition-colors ${!isAvailable ? 'opacity-60' : ''
                          }`}
                      >
                        {/* 1. COLUMNA IMAGEN */}
                        <td className="w-26 p-2">
                          <div
                            onClick={() => setSelectedProduct(item)}
                            className="w-24 h-24 bg-gray-50 overflow-hidden border border-gray-100 cursor-pointer"
                          >
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <ImageIcon size={16} />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 2. COLUMNA TEXTO*/}
                        <td className="p-2 min-w-0">
                          <div className="flex flex-col justify-between">
                            <h3 className="font-bold text-[20px] uppercase italic tracking-tighter leading-tight text-black line-clamp-2">
                              {item.name}
                            </h3>
                            <span className="font-black text-1xl text-orange-600 mt-0.5">
                              ${item.price}
                            </span>
                          </div>
                        </td>

                        {/* 3. COLUMNA ACCIÓN */}
                        <td className="w-[100px] p-2 pr-3 text-right align-middle">
                          <div className="flex justify-end">
                            {!isInCart ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  isAvailable && isOpenBusiness && addToCart(item);
                                }}
                                disabled={!isOpenBusiness || !isAvailable}
                                className={`w-[90px] h-[42px] font-black text-[10px] uppercase rounded-full tracking-wider transition-all ${!isAvailable || !isOpenBusiness
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-black text-white active:scale-95'
                                  }`}
                              >
                                {isAvailable ? 'Comprar' : 'Agotado'}
                              </button>
                            ) : (
                              <div className="w-[90px]" onClick={(e) => e.stopPropagation()}>
                                <QuantitySelector product={item} />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}