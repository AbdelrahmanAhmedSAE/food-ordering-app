import httpClient from "@/lib/http-client";

const cartItemService = {
  deleteCartItem: async (cartItemId: string) => {
    return httpClient.delete(`/api/v1/cart/item/${cartItemId}`);
  },
};

export default cartItemService;
