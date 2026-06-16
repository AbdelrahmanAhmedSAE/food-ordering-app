import { Prisma } from 'src/generated/prisma/client';

const cartItemExtraDetailQuery = {
  include: {
    productExtra: {
      select: {
        id: true,
        name: true,
        price: true,
      },
    },
  },
} satisfies Prisma.CartItemExtraDefaultArgs;

export type RawCartItemExtraDetail = Prisma.CartItemExtraGetPayload<
  typeof cartItemExtraDetailQuery
>;

export const cartItemDetailQuery = {
  include: {
    cartItemExtras: { ...cartItemExtraDetailQuery },
    productVariant: {
      select: {
        id: true,
        name: true,
        price: true,
        product: {
          select: {
            name: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartItemDefaultArgs;

export type RawCartItemDetail = Prisma.CartItemGetPayload<
  typeof cartItemDetailQuery
>;

export const cartDetailQuery = {
  include: {
    cartItems: { ...cartItemDetailQuery },
  },
} satisfies Prisma.CartDefaultArgs;

export type RawCartDetail = Prisma.CartGetPayload<typeof cartDetailQuery>;
