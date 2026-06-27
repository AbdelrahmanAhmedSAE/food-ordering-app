import { latestProductsService } from "../services/latestProductsService";
import { ProductsSection } from "@/components/product/ProductsSection";

export const LatestProductsSection = async () => {
  const { data } = await latestProductsService
    .get()
    .catch(() => ({ data: [] }));

  if (data.length < 3) return null;

  return <ProductsSection title="Latest Products" products={data} />;
};
