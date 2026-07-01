import { Category, Product } from '../../src/generated/prisma/client';
import prisma from './prisma';

const pizzaNames: readonly string[] = [
  'Margherita',
  'BBQ Chicken',
  'Pepperoni',
  'Hawaiian',
  'Veggie Delight',
  'Four Cheese',
  'Meat Lovers',
  'Spicy Italian',
  'Seafood Special',
  'Mushroom Classic',
] as const;

export default async function seedPizzaProducts(
  categories: Category[],
): Promise<Product[]> {
  const category: Category | undefined = categories.find(
    (category) => category.name.toLowerCase() === 'pizza',
  );

  if (!category) throw new Error('Pizza category not found');

  const createdPizzas: Product[] = [];

  for (const pizzaName of pizzaNames) {
    const slug = `${category?.name.toLowerCase()}-${pizzaName.toLowerCase().replace(/\s+/g, '-')}`;
    const createdPizza = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: pizzaName,
        slug,
        description: 'this is the pizza that is good',
      },
    });

    await prisma.productCategory.upsert({
      where: {
        productId_categoryId: {
          productId: createdPizza.id,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        productId: createdPizza.id,
        categoryId: category.id,
        isPrimary: pizzaName === pizzaNames[0],
      },
    });

    createdPizzas.push(createdPizza);
  }

  return createdPizzas;
}

export async function seedProducts(
  categories: Category[],
  categoryName: string,
  productNames: readonly string[],
  description: string,
): Promise<Product[]> {
  const category = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!category) throw new Error(`${categoryName} category not found`);

  const createdProducts: Product[] = [];

  for (const [i, name] of productNames.entries()) {
    const slug = `${category.slug}-${name.toLowerCase().replace(/\s+/g, '-')}`;
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description },
    });

    await prisma.productCategory.upsert({
      where: {
        productId_categoryId: {
          productId: product.id,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        categoryId: category.id,
        isPrimary: i === 0,
      },
    });

    createdProducts.push(product);
  }

  return createdProducts;
}
