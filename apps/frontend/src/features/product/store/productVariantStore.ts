import type { ProductVariant } from "@repo/shared";
import { create } from "zustand";

const initProductVariant: ProductVariant = {
  id: "",
  name: "",
  price: 0,
  isAvailable: false,
  sku: null,
  createdAt: "",
  updatedAt: "",
};

interface ProductVariantStore {
  selectedVariant: ProductVariant;
  quantity: number;
  setVariant: (pv: ProductVariant) => void;
  setVariantQuantity: (quantity: number) => void;
  clearVariantStore: () => void;
}

export const useProductVariantStore = create<ProductVariantStore>((set) => ({
  selectedVariant: initProductVariant,
  quantity: 1,
  setVariant: (pv) => set(() => ({ selectedVariant: pv })),
  setVariantQuantity: (q) => set(() => ({ quantity: q })),
  clearVariantStore: () =>
    set(() => ({ selectedVariant: initProductVariant, quantity: 0 })),
}));
