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
  selectedProductVariant: ProductVariantDto;
  quantity: number;
  setProductVariant: (pv: ProductVariantDto) => void;
  setProductVariantQuantity: (quantity: number) => void;
}

const useProductVariantStore = create<ProductVariantStore>((set) => ({
  selectedProductVariant: initProductVariant,
  quantity: 0,
  setProductVariant: (pv) => set(() => ({ selectedProductVariant: pv })),
  setProductVariantQuantity: (q) => set(() => ({ quantity: q })),
}));

export default useProductVariantStore;
