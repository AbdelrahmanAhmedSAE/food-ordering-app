import { httpClient } from "@/lib/http-client";
import type {
  CartDetail,
  CreateCartItemSchema,
  ProductExtra,
  ProductVariant,
} from "@repo/shared";

export const cartClientService = {
  addToCart: async (
    productVariant: ProductVariant,
    variantQuantity: number,
    extras: { extra: ProductExtra; quantity: number }[]
  ) =>
    httpClient.post<CartDetail, CreateCartItemSchema>("/api/v1/cart/item", {
      productVariantId: productVariant.id,
      quantity: variantQuantity,
      extras: extras.map((extra) => ({
        extraId: extra.extra.id,
        quantity: extra.quantity,
      })),
    }),
};
