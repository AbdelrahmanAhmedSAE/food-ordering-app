import ProductCard from "@/components/productCard";
import { fetchClient } from "@/lib/fetchClient";
import type { MinimalProductDto } from "@/lib/types/product";

const LatestProducts = async () => {
  const { data: latestProducts } = await fetchClient<MinimalProductDto[]>(
    "/api/v1/product/latest-product"
  );

  return (
    <section className="flex flex-col gap-35 mx-14 my-40">
      <h2 className="text-primary text-center font-black text-5xl">
        Latest Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-rows-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-10">
        <ProductCard product={latestProducts[0]} />
        <ProductCard
          className="lg:-translate-y-10"
          product={latestProducts[1]}
        />
        <ProductCard product={latestProducts[2]} />
      </div>
    </section>
  );
};

export default LatestProducts;
