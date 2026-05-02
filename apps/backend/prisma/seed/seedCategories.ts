import { Category } from '../../src/generated/prisma/client';
import prisma from './prisma';

const categoriesData: readonly {
  name: string;
  slug: string;
  isActive: boolean;
}[] = [
  { name: 'Pizza', slug: 'pizza', isActive: true },
  { name: 'Burger', slug: 'burger', isActive: true },
  { name: 'Sandwich', slug: 'sandwich', isActive: true },
  { name: 'Drinks', slug: 'drinks', isActive: true },
  { name: 'Desserts', slug: 'desserts', isActive: false },
] as const;

export default async function seedCategories(): Promise<Category[]> {
  const createdCategories: Category[] = [];

  for (const category of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        isActive: category.isActive,
      },
    });

    createdCategories.push(created);
  }

  return createdCategories;
}
