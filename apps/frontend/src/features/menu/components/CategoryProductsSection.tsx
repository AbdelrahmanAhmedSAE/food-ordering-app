import { ProductCard } from "@/components/product/ProductCard";
import { categoryService } from "../services/categoryService";
import type { ProductSummery } from "@repo/shared";
import { ScrollAnimation } from "@/components/animations/ScrollAnimation";

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
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full p-4 isolate">
      {data.map((product: ProductSummery, i: number) => (
        <ScrollAnimation key={product.id} delay={i * 0.1}>
          <ProductCard product={product} className="w-full" />
        </ScrollAnimation>
      ))}
    </section>
  );
};
