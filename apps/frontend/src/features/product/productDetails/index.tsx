import { fetchClient } from "@/lib/fetchClient";
import type { ProductDto } from "@/lib/types/product";
import ProductDetailsCard from "./components/ProductDetailsCard";

interface ProductDetailsPageBodyProps {
  slug: string;
}

export default async function ProductDetailsPageBody({
  slug,
}: ProductDetailsPageBodyProps) {
  const { data: product } = await fetchClient<ProductDto>(
    `/api/v1/product/slug/${slug}`
  );

  return (
    <main className="w-screen h-screen p-40">
      <ProductDetailsCard product={product} />
    </main>
  );
}
