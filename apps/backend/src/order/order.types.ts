import { Order, OrderItem, OrderItemExtra } from 'src/generated/prisma/client';

export type MinimalOrder = Omit<Order, 'totalPrice' | 'user' | 'createdAt'> & {
  totalPrice: number;
  createdAt: string;
};

export type OrderWithItemsFromDB = Order & {
  items: (OrderItem & { orderItemExtras: OrderItemExtra[] })[];
};

export type OrderWithItems = Omit<Order, 'totalPrice' | 'createdAt'> & {
  totalPrice: number;
  createdAt: string;
  items: Array<
    Omit<OrderItem, 'totalPrice' | 'createdAt' | 'productVariant'> & {
      totalPrice: number;
      extras: Array<
        Omit<OrderItemExtra, 'totalPrice' | 'createdAt'> & {
          totalPrice: number;
        }
      >;
    }
  >;
};
