import type { ProductExtra } from "@repo/shared";
import { create } from "zustand";

interface ProductExtrasStore {
  extras: { extra: ProductExtra; quantity: number }[];
  addExtra: (productExtra: ProductExtra, quantity: number) => void;
  clearExtraStore: () => void;
}

export const useProductExtrasStore = create<ProductExtrasStore>((set, get) => ({
  extras: [],
  addExtra: (productExtra, quantity) => {
    const filtered = get().extras.filter((e) => e.extra.id !== productExtra.id);
    set(() => ({
      extras: [...filtered, { extra: productExtra, quantity }],
    }));
  },
  clearExtraStore: () => set(() => ({ extras: [] })),
}));
