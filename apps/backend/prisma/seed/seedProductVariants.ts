import { Product, ProductVariant } from '../../src/generated/prisma/client';
import prisma from './prisma';
import generateSku from '../../src/lib/sku';

const sizePriceMap = {
  Small: 80,
  Medium: 120,
  Large: 160,
} as const;

export default async function SeedProductVariants(
  products: Product[],
): Promise<ProductVariant[]> {
  const sizes: readonly string[] = ['Small', 'Medium', 'Large'];
  const createdVariants: ProductVariant[] = [];

  for (const product of products) {
    for (const size of sizes) {
      const price: number = sizePriceMap[size] as number;
      const sku = generateSku(product.name, size);
      const isAvailable =
        size != 'Large' && product.name.toLocaleLowerCase().includes('i');

      const createdVariant = await prisma.productVariant.upsert({
        where: { sku },
        update: {},
        create: {
          name: size,
          price,
          isAvailable,
          productId: product.id,
          sku,
        },
      });

      createdVariants.push(createdVariant);
    }
  }

  return createdVariants;
}
