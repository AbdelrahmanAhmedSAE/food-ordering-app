import { Decimal } from '@prisma/client/runtime/client';
import { Cart, CartItem, CartItemExtra } from 'src/generated/prisma/client';

export type CartItemExtraWithExtraFromDB = CartItemExtra & {
  productExtra: { id: string; name: string; price: Decimal };
};

export type CartItemWithExtrasAndProductVariantFromDB = CartItem & {
  cartItemExtras: CartItemExtraWithExtraFromDB[];
  productVariant: { id: string; name: string; price: Decimal } & {
    product: { name: string; images: { url: string }[] };
  };
};

export type CartWithItemsFromDB = Cart & {
  cartItems: CartItemWithExtrasAndProductVariantFromDB[];
};

export type CartItemExtraWithExtra = CartItemExtra & {
  productExtra: { id: string; name: string; price: number };
};

export type CartItemWithExtrasAndProductVariant = Omit<
  CartItem,
  'totalPrice'
> & {
  productName: string;
  productImage: { url: string };
  totalPrice: number;
  cartItemExtras: CartItemExtraWithExtra[];
  productVariant: { id: string; name: string; price: number };
};

export type CartWithItems = Omit<Cart, 'totalPrice'> & {
  totalPrice: number;
  cartItems: CartItemWithExtrasAndProductVariant[];
};
