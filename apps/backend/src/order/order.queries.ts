import { Prisma } from 'src/generated/prisma/client';

const orderItemExtraQuery = {
  select: {
    id: true,
    name: true,
    totalPrice: true,
    quantity: true,
    orderItemId: true,

    createdAt: true,
  },
} satisfies Prisma.OrderItemExtraDefaultArgs;

export type RawOrderItemExtra = Prisma.OrderItemExtraGetPayload<
  typeof orderItemExtraQuery
>;

const orderItemDetailQuery = {
  select: {
    id: true,
    name: true,
    totalPrice: true,
    quantity: true,
    orderId: true,

    orderItemExtras: {
      ...orderItemExtraQuery,
    },

    createdAt: true,
  },
} satisfies Prisma.OrderItemDefaultArgs;

export type RawOrderItemDetail = Prisma.OrderItemGetPayload<
  typeof orderItemDetailQuery
>;

export const orderDetailQuery = {
  include: {
    items: {
      ...orderItemDetailQuery,
    },
  },
} satisfies Prisma.OrderDefaultArgs;

export type RawOrderDetail = Prisma.OrderGetPayload<typeof orderDetailQuery>;
