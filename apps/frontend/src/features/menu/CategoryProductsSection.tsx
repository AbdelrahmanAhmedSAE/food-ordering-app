import ProductCard from "@/components/productCard";
import { fetchClient } from "@/lib/fetchClient";
import type { MinimalProductDto } from "@/lib/types/product";

interface CategoryProductsSectionProps {
  categoryId?: string | undefined;
}

const CategoryProductsSection = async ({
  categoryId,
}: CategoryProductsSectionProps) => {
  const url = categoryId
    ? `/api/v1/product/category/${categoryId}`
    : `/api/v1/product/`;

  const { data: products } = await fetchClient<MinimalProductDto[]>(url);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} className="w-full" />
      ))}
    </section>
  );
};

export default CategoryProductsSection;
