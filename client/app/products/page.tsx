// app/products/page.tsx
import { searchProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import FilterOptions from "@/components/search/FilterOptions";
import { Product } from "@/types";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const products = await searchProducts(searchParams.search);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        <aside className="w-64">
          <FilterOptions />
        </aside>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            Search Results for "{searchParams.search}"
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}