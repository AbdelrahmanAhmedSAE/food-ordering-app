import type { ProductExtraDto, ProductVariantDto } from "@/lib/types/product";

export interface CartItemExtraDto {
  id: string;
  cartItemId: string;
  quantity: number;
  productExtraId: string;
  productExtra: Pick<ProductExtraDto, "id" | "name" | "price">;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDto {
  id: string;
  cartId: string;
  quantity: number;
  totalPrice: number;
  productName: string;
  productImage: { url: string };
  productVariantId: string;
  productVariant: Pick<ProductVariantDto, "id" | "name" | "price">;
  cartItemExtras: CartItemExtraDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CartDto {
  id: string;
  userId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItemDto[];
}
