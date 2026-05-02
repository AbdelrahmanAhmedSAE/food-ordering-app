import type { Product, ProductExtra } from '../../src/generated/prisma/client';
import prisma from './prisma';
import generateSku from '../../src/lib/sku';
import { Decimal } from '@prisma/client/runtime/client';

const pizzaExtras: readonly { name: string; price: number }[] = [
  { name: 'Extra Cheese', price: 20 },
  { name: 'Extra Sauce', price: 10 },
  { name: 'Bacon', price: 30 },
] as const;

export default async function seedPizzaExtras(
  products: Product[],
): Promise<ProductExtra[]> {
  const createdExtras: ProductExtra[] = [];

  for (const product of products) {
    for (const extra of pizzaExtras) {
      const sku = generateSku(product.name, extra.name);
      const isAvailable =
        extra.name !== 'Bacon' &&
        product.name.toLocaleLowerCase().includes('i');

      const createdExtra = await prisma.productExtra.upsert({
        where: { sku },
        update: {},
        create: {
          name: extra.name,
          price: new Decimal(extra.price),
          isAvailable,
          productId: product.id,
          sku,
        },
      });

      createdExtras.push(createdExtra);
    }
  }

  return createdExtras;
}

export async function seedExtras(
  products: Product[],
  extras: readonly { name: string; price: number }[],
): Promise<ProductExtra[]> {
  const createdExtras: ProductExtra[] = [];

  for (const product of products) {
    for (const extra of extras) {
      const sku = generateSku(product.name, extra.name);
      const isAvailable = Math.random() > 0.2;
      const createdExtra = await prisma.productExtra.upsert({
        where: { sku },
        update: {},
        create: {
          name: extra.name,
          price: new Decimal(extra.price),
          isAvailable,
          productId: product.id,
          sku,
        },
      });
      createdExtras.push(createdExtra);
    }
  }

  return createdExtras;
}
