"use client";
import { useProductVariantStore } from "../store/productVariantStore";
import { QuantityControl } from "@/components/product/QuantityControl";

export const VariantQuantityControl = () => {
  const quantity = useProductVariantStore((state) => state.quantity);
  const setQuantity = useProductVariantStore(
    (state) => state.setVariantQuantity
  );

  return <QuantityControl value={quantity} onChange={setQuantity} min={1} />;
};
