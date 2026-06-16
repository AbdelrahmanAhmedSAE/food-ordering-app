import { Prisma } from 'src/generated/prisma/client';

export const productDetailQuery = {
  include: {
    variants: true,
    extras: true,
    images: true,
  },
} satisfies Prisma.ProductDefaultArgs;

export type RawProductDetail = Prisma.ProductGetPayload<
  typeof productDetailQuery
>;

export const productSummeryQuery = {
  include: {
    images: {
      where: { isPrimary: true },
      select: {
        url: true,
      },
      take: 1,
    },
    variants: {
      where: { isAvailable: true },
      orderBy: { price: 'asc' },
      select: {
        price: true,
      },
      take: 1,
    },
  },
} satisfies Prisma.ProductDefaultArgs;

export type RawProductSummery = Prisma.ProductGetPayload<
  typeof productSummeryQuery
>;
