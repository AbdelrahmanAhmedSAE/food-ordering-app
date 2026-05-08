import ProductCard from "@/components/productCard";
import { fetchClient } from "@/lib/fetchClient";
import type { MinimalProductDto } from "@/lib/types/product";

const BestSellers = async () => {
  const { data: bestSellers } = await fetchClient<MinimalProductDto[]>(
    "/api/v1/product/best-sellers"
  );

  return (
    <section className="flex flex-col gap-35 mx-14 my-40">
      <h2 className="text-primary text-center font-black text-5xl">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-rows-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-10">
        <ProductCard product={bestSellers[0]} />
        <ProductCard className="lg:-translate-y-10" product={bestSellers[1]} />
        <ProductCard product={bestSellers[2]} />
      </div>
    </section>
  );
};

export default BestSellers;
