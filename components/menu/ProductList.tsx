'use client';
import ProductCard from './ProductCard';

interface ProductListProps {
  categories: any[];
  products: any[];
  filter: string | null;
  isOpen: boolean;
  onOpenModal: (product: any) => void;
}

export default function ProductList({ categories, products, filter, isOpen, onOpenModal }: ProductListProps) {
  return (
    <div className="space-y-12">
      {categories
        .filter(cat => !filter || cat.id === filter)
        .map(category => {
          const categoryProducts = products
            .filter(p => p.category_id === category.id)
            .sort((a, b) => a.name.localeCompare(b.name));

          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] whitespace-nowrap">
                  {category.name}
                </h2>
                <div className="h-px bg-gray-50 w-full"></div>
              </div>

              <div className="space-y-1">
                {categoryProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    isOpenBusiness={isOpen} 
                    onOpenModal={onOpenModal}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}