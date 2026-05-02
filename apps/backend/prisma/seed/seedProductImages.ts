import type { Product, ProductImage } from '../../src/generated/prisma/client';
import prisma from './prisma';

const pizzaImageFiles: readonly string[] = [
  '/pizza1.jpg',
  '/pizza2.jpg',
  '/pizza3.jpg',
] as const;

export default async function seedPizzaImages(
  products: Product[],
): Promise<ProductImage[]> {
  const createdImages: ProductImage[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    if (i % 5 === 0) continue;

    const primaryImage = pizzaImageFiles[i % pizzaImageFiles.length];

    const secondaryImages = pizzaImageFiles.filter(
      (img) => img !== primaryImage,
    );

    const mainImage = await prisma.productImage.upsert({
      where: { url_productId: { url: primaryImage, productId: product.id } },
      update: {},
      create: {
        url: primaryImage,
        isPrimary: true,
        productId: product.id,
      },
    });
    createdImages.push(mainImage);

    for (const secondary of secondaryImages) {
      const secondaryImage = await prisma.productImage.upsert({
        where: { url_productId: { url: secondary, productId: product.id } },
        update: {},
        create: {
          url: secondary,
          isPrimary: false,
          productId: product.id,
        },
      });

      createdImages.push(secondaryImage);
    }
  }

  return createdImages;
}

export async function seedImages(
  products: Product[],
  imageFiles: readonly string[],
): Promise<ProductImage[]> {
  const createdImages: ProductImage[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    if (i % 5 === 0) continue;

    const primaryImage = imageFiles[i % imageFiles.length];
    const secondaryImages = imageFiles.filter((img) => img !== primaryImage);

    const mainImage = await prisma.productImage.upsert({
      where: { url_productId: { url: primaryImage, productId: product.id } },
      update: {},
      create: { url: primaryImage, isPrimary: true, productId: product.id },
    });
    createdImages.push(mainImage);

    for (const secondary of secondaryImages) {
      const secImage = await prisma.productImage.upsert({
        where: { url_productId: { url: secondary, productId: product.id } },
        update: {},
        create: { url: secondary, isPrimary: false, productId: product.id },
      });
      createdImages.push(secImage);
    }
  }

  return createdImages;
}
