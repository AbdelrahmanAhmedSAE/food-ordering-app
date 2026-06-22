import { httpClient } from "@/lib/http-client";
import type {
  CartDetail,
  CreateCartItemDto,
  ProductExtra,
  ProductVariant,
} from "@repo/shared";

export const cartClientService = {
  addToCart: async (
    productVariant: ProductVariant,
    variantQuantity: number,
    extras: { extra: ProductExtra; quantity: number }[]
  ) => {
    if (productVariant.name.trim().length > 0 && variantQuantity > 0) {
      const result = await httpClient.post<CartDetail, CreateCartItemDto>(
        "/api/v1/cart/item",
        {
          productVariantId: productVariant.id,
          quantity: variantQuantity,
          extras: extras.map((extra) => ({
            extraId: extra.extra.id,
            quantity: extra.quantity,
          })),
        }
      );

      if (result) return true;
    }

    return false;
  },
};
