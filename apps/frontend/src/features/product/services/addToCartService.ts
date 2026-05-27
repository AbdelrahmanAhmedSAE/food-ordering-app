import httpClient from "@/lib/http-client";
import { ProductExtraDto, ProductVariantDto } from "@/lib/types/product";
import {
  CartWithItemsDto,
  CreateCartItemDto,
} from "../types/addProductToCartTypes";
import { toast } from "sonner";

const addToCartService = {
  addToCart: async (
    productVariant: ProductVariantDto,
    variantQuantity: number,
    extras: { extra: ProductExtraDto; quantity: number }[]
  ) => {
    console.log("Data to post: ", productVariant, variantQuantity, extras);
    try {
      if (productVariant.name.trim().length > 0 && variantQuantity > 0) {
        const result = await httpClient.post<
          CartWithItemsDto,
          CreateCartItemDto
        >("/api/v1/cart/item", {
          productVariantId: productVariant.id,
          quantity: variantQuantity,
          extras: extras.map((extra) => ({
            extraId: extra.extra.id,
            quantity: extra.quantity,
          })),
        });

        if (result) return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) toast.error(error?.message as string);
      return false;
    }
  },
};

export default addToCartService;
