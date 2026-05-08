import {
  Cart,
  CartItem,
  CartItemExtra,
  Product,
  ProductExtra,
  ProductVariant,
} from 'src/generated/prisma/client';

export type CartItemWithExtras = CartItem & { cartItemExtras: CartItemExtra[] };
export type CartItemWithExtrasAndProductVariant = CartItem & {
  cartItemExtras: CartItemExtra[];
  productVariant: ProductVariant & {
    product: Product & { extras: ProductExtra[] };
  };
};

export type CartWithItems = Cart & { cartItems: CartItemWithExtras[] };
