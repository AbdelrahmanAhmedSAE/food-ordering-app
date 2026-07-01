import type {
  Product,
  ProductVariant,
} from '../../src/generated/prisma/client';
import prisma from './prisma';

const sizePriceMap = {
  Small: 80,
  Medium: 120,
  Large: 160,
} as const;

export default async function SeedProductVariants(
  products: Product[],
): Promise<ProductVariant[]> {
  const sizes: readonly string[] = ['Small', 'Medium', 'Large'] as const;
  const createdVariants: ProductVariant[] = [];

  for (const product of products) {
    for (const size of sizes) {
      const price: number = sizePriceMap[size] as number;
      const isAvailable =
        size != 'Large' && product.name.toLocaleLowerCase().includes('i');

      const createdVariant = await prisma.productVariant.upsert({
        where: { productId_name: { productId: product.id, name: size } },
        update: {},
        create: {
          name: size,
          price,
          isAvailable,
          productId: product.id,
        },
      });

      createdVariants.push(createdVariant);
    }
  }

  return createdVariants;
}
