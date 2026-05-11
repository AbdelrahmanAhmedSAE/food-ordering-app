import type { ProductDto } from "@/lib/types/product";
import ProductDetailsCard from "./components/ProductDetailsCard";
import httpClient from "@/lib/http-client";

interface ProductDetailsPageBodyProps {
  slug: string;
}

export default async function ProductDetailsPageBody({
  slug,
}: ProductDetailsPageBodyProps) {
  const { data: product } = await httpClient.get<ProductDto>(
    `/api/v1/product/slug/${slug}`
  );

  return (
    <main className="w-screen h-screen p-40">
      <ProductDetailsCard product={product} />
    </main>
  );
}
