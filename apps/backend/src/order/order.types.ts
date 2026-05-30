import { Order } from 'src/generated/prisma/client';

export type MinimalOrder = Omit<Order, 'totalPrice' | 'user' | 'createdAt'> & {
  totalPrice: number;
  createdAt: string;
};
