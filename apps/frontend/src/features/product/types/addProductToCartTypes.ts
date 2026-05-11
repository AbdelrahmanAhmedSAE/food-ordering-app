import {
  ProductDto,
  ProductExtraDto,
  ProductVariantDto,
} from "@/lib/types/product";

export interface CreateCartItemDto {
  productVariantId: string;
  quantity: number;
}

export interface CreateCartItemExtraDto {
  extraId: string;
  quantity: number;
}

interface CartDto {
  id: string;
  userId: string;

  cartItems: CartItemDto[];

  createdAt: string;
  updatedAt: string;
}

interface CartItemDto {
  id: string;
  cartId: string;

  productVariantId: string;
  quantity: number;

  cartItemExtras: CartItemExtraDto[];

  createdAt: string;
  updatedAt: string;
}

interface CartItemExtraDto {
  id: string;
  cartId: string;

  productExtraId: string;
  quantity: number;

  cartItemId: string;

  createdAt: string;
  updatedAt: string;
}

export type CartItemWithExtrasDto = CartItemDto & {
  cartItemExtras: CartItemExtraDto[];
};

export type CartItemWithExtrasAndProductVariant = CartItemDto & {
  cartItemExtras: CartItemExtraDto[];
  productVariant: ProductVariantDto & {
    product: ProductDto & { extras: ProductExtraDto[] };
  };
};

export type CartWithItemsDto = CartDto & { cartItems: CartItemWithExtrasDto[] };
