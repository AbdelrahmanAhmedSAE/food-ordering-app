import { ProductsSection } from "@/components/product/ProductsSection";
import { bestSellersService } from "../services/bestSellersService";

export const BestSellersSection = async () => {
  const { data } = await bestSellersService.get().catch(() => ({ data: [] }));
  if (data.length < 3) return null;

  return <ProductsSection title="Best Sellers" products={data} />;
};
