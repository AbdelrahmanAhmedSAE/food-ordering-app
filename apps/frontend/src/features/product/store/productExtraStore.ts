import type { ProductExtraDto } from "@/lib/types/product";
import { create } from "zustand";

const initProductExtra: ProductExtraDto = {
  id: "",
  name: "",
  price: "",
  isAvailable: false,
  sku: null,
  createdAt: "",
  updatedAt: "",
};

interface ProductExtraStore {
  selectedProductExtra: ProductExtraDto;
  quantity: number;
  setProductExtra: (pe: ProductExtraDto) => void;
  setProductExtraQuantity: (quantity: number) => void;
}

const useProductExtraStore = create<ProductExtraStore>((set) => ({
  selectedProductExtra: initProductExtra,
  quantity: 0,
  setProductExtra: (pe) => set(() => ({ selectedProductExtra: pe })),
  setProductExtraQuantity: (q) => set(() => ({ quantity: q })),
}));

export default useProductExtraStore;
