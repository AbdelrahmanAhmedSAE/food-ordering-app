import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummery } from "@repo/shared";
import { ScrollAnimation } from "../animations/ScrollAnimation";

interface ProductsSectionProps {
  title: string;
  products: ProductSummery[];
}

export const ProductsSection = ({ title, products }: ProductsSectionProps) => (
  <section className="flex flex-col gap-24 px-8 py-16">
    <h2 className="text-primary text-center font-black text-5xl">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {products.slice(0, 3).map((product, i) => (
        <ScrollAnimation key={product.id} delay={i * 0.15}>
          <ProductCard
            className={i === 1 ? "lg:-translate-y-10" : undefined}
            product={product}
          />
        </ScrollAnimation>
      ))}
    </div>
  </section>
);
