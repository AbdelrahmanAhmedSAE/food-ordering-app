import { OrderStatus, PaymentMethod, PaymentStatus } from "../enums/order";

export interface OrderDto {
  id: string;

  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  userId: string;
  paymentIntentId: string | null;
  totalPrice: number;
  deliveryAddress: string;

  items: OrderItemDto[];
  createdAt: string;
}

export interface OrderItemDto {
  id: string;

  name: string;
  quantity: number;
  totalPrice: number;

  orderId: string;
  productVariantId: string;

  orderItemExtras: OrderItemExtraDto[];

  createdAt: string;
}

export interface OrderItemExtraDto {
  id: string;

  name: string;
  quantity: number;
  totalPrice: number;

  orderItemId: string;
  productExtraId: string;

  createdAt: string;
}
