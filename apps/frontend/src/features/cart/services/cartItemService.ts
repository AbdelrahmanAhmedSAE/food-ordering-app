import { httpClient } from "@/lib/http-client";

export const cartItemService = {
  deleteCartItem: async (cartItemId: string) =>
    httpClient.delete(`/api/v1/cart/item/${cartItemId}`),
};
