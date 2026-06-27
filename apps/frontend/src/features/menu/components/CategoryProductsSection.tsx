import { ProductCard } from "@/components/product/ProductCard";
import { categoryService } from "../services/categoryService";
import type { ProductSummery } from "@repo/shared";

interface CategoryProductsSectionProps {
  categoryId?: string;
}

export const CategoryProductsSection = async ({
  categoryId,
}: CategoryProductsSectionProps) => {
  const { data } = await categoryService
    .getCategoryProducts(categoryId)
    .catch(() => ({ data: [] }));

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
      {data.map((product: ProductSummery) => (
        <ProductCard key={product.id} product={product} className="w-full" />
      ))}
    </section>
  );
};
