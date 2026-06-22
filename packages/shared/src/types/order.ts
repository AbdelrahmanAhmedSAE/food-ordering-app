import { OrderStatus, PaymentMethod, PaymentStatus } from "../enums";
import { Nullable } from "./nullable";

export interface OrderItemExtra {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  orderItemId: string;

  createdAt: string;
}

export interface OrderItemDetail {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  orderId: string;

  extras: OrderItemExtra[];

  createdAt: string;
}

export interface OrderDetail {
  id: string;
  userId: string;
  totalPrice: number;
  paymentIntentId: Nullable<string>;
  deliveryAddress: string;

  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  items: OrderItemDetail[];

  createdAt: string;
}

export interface OrderSummary extends Omit<OrderDetail, "items"> {}
