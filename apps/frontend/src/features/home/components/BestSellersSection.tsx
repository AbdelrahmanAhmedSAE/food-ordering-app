import { ProductCard } from "@/components/ProductCard";
import { bestSellersService } from "../services/bestSellersService";
import type { ProductSummery } from "@repo/shared";

export const BestSellersSection = async () => {
  const { data } = await bestSellersService.get();

  if (data.length < 3) return null;

  return (
    <section className="flex flex-col gap-35 mx-14 my-40">
      <h2 className="text-primary text-center font-black text-5xl">
        Best Sellers
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
