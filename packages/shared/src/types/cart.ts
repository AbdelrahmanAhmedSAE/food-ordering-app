export interface CartItemExtraDetail {
  id: string;
  itemId: string;
  quantity: number;
  totalPrice: number;

  productExtra: { id: string; name: string; price: number };

  createdAt: string;
  updatedAt: string;
}

export interface CartItemDetail {
  id: string;
  cartId: string;
  quantity: number;
  totalPrice: number;
  productName: string;

  productVariant: {
    id: string;
    name: string;
    price: number;
    image: { url: string };
  };
  cartItemExtras: CartItemExtraDetail[];

  createdAt: string;
  updatedAt: string;
}

export interface CartDetail {
  id: string;
  userId: string;
  totalPrice: number;

  cartItems: CartItemDetail[];

  createdAt: string;
  updatedAt: string;
}
