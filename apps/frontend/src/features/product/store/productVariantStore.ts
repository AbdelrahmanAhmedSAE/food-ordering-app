import { ProductVariantDto } from "@/lib/types/product";
import { create } from "zustand";

const initProductVariant: ProductVariantDto = {
  id: "",
  name: "",
  price: "",
  isAvailable: false,
  sku: null,
  createdAt: "",
  updatedAt: "",
};

interface ProductVariantStore {
  selectedVariant: ProductVariantDto;
  quantity: number;
  setVariant: (pv: ProductVariantDto) => void;
  setVariantQuantity: (quantity: number) => void;
  clearVariantStore: () => void;
}

const useProductVariantStore = create<ProductVariantStore>((set) => ({
  selectedVariant: initProductVariant,
  quantity: 0,
  setVariant: (pv) => set(() => ({ selectedVariant: pv })),
  setVariantQuantity: (q) => set(() => ({ quantity: q })),
  clearVariantStore: () =>
    set(() => ({ selectedVariant: initProductVariant, quantity: 0 })),
}));

export default useProductVariantStore;
