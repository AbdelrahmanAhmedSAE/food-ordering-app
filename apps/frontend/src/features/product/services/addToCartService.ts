import httpClient from "@/lib/http-client";
import { ProductExtraDto, ProductVariantDto } from "@/lib/types/product";
import {
  CartItemWithExtrasAndProductVariant,
  CartWithItemsDto,
  CreateCartItemDto,
  CreateCartItemExtraDto,
} from "../types/addProductToCartTypes";
import { toast } from "sonner";

const addToCartService = {
  addToCart: async (
    productVariant: ProductVariantDto,
    variantQuantity: number
    // productExtra: ProductExtraDto,
    // extraQuantity: number
  ) => {
    try {
      const result = await addToCartService.addVariantToCart(
        productVariant,
        variantQuantity
      );

      if (result) return true;
      return false;
    } catch (error) {
      if (error instanceof Error) toast.error(error?.message as string);
      return false;
    }
  },
  addVariantToCart: async (
    productVariant: ProductVariantDto,
    quantity: number
  ) => {
    if (productVariant.name.trim().length > 0 && quantity > 0) {
      return httpClient.post<CartWithItemsDto, CreateCartItemDto>(
        "/api/v1/cart/item",
        {
          productVariantId: productVariant.id,
          quantity: quantity,
        }
      );
    }
  },
  addExtraToCartItem: async (
    itemId: string,
    productExtra: ProductExtraDto,
    quantity: number
  ) => {
    if (productExtra.name.trim().length > 0 && quantity > 0) {
      return httpClient.post<
        CartItemWithExtrasAndProductVariant,
        CreateCartItemExtraDto
      >(`/api/v1/cart/item/${itemId}/extra`, {
        extraId: productExtra.id,
        quantity,
      });
    }
  },
};

export default addToCartService;
