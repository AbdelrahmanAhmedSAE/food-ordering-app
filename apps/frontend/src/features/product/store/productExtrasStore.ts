import type { ProductExtraDto } from "@/lib/types/product";
import { create } from "zustand";

interface ProductExtraStore {
  extras: { extra: ProductExtraDto; quantity: number }[];
  addExtra: (productExtra: ProductExtraDto, quantity: number) => void;
  clearExtraStore: () => void;
}

const useProductExtraStore = create<ProductExtraStore>((set, get) => ({
  extras: [],
  addExtra: (productExtra, quantity) => {
    const filtered = get().extras.filter((e) => e.extra.id !== productExtra.id);
    set(() => ({
      extras: [...filtered, { extra: productExtra, quantity }],
    }));
  },
  clearExtraStore: () => set(() => ({ extras: [] })),
}));

export default useProductExtraStore;
