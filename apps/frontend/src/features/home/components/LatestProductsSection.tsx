import { ProductCard } from "@/components/ProductCard";
import type { ProductSummery } from "@repo/shared";
import { latestProductsService } from "../services/latestProductsService";

export const LatestProductsSection = async () => {
  const { data } = await latestProductsService
    .get()
    .catch(() => ({ data: [] }));

  if (data.length < 3) return null;

  return (
    <section className="flex flex-col gap-35 mx-14 my-40">
      <h2 className="text-primary text-center font-black text-5xl">
        Latest Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-rows-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-10">
        {data.slice(0, 3).map((product: ProductSummery, i: number) => (
          <ProductCard
            key={product.id}
            className={i === 1 ? "lg:-translate-y-10" : undefined}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};
