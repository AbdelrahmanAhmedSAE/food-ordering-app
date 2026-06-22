import { Injectable } from '@nestjs/common';
import type { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CategorySummery, Nullable } from '@repo/shared';
import type { Category } from 'src/generated/prisma/client';
import {
  CategoryNotFoundException,
  CategoryAlreadyExistedException,
} from 'src/common/exceptions';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySummery> {
    const category: Nullable<Category> =
      await this.prismaService.category.findUnique({
        where: { name: createCategoryDto.name },
      });

    if (category) throw new CategoryAlreadyExistedException();

    const slug = this.generateSlug(createCategoryDto.name);
    const newCategory = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
      },
    });

    return this.mapCategorySummery(newCategory);
  }

  public async findAll(): Promise<CategorySummery[]> {
    const categories = await this.prismaService.category.findMany();
    return categories.map<CategorySummery>((category) =>
      this.mapCategorySummery(category),
    );
  }

  public async findOne(id: string): Promise<CategorySummery> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new CategoryNotFoundException();

    return this.mapCategorySummery(category);
  }

  public async setInactive(id: string): Promise<CategorySummery> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new CategoryNotFoundException();

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: { isActive: false },
    });

    return this.mapCategorySummery(updatedCategory);
  }

  public async setActive(id: string): Promise<CategorySummery> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new CategoryNotFoundException();

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: { isActive: true },
    });

    return this.mapCategorySummery(updatedCategory);
  }

  public async remove(id: string): Promise<void> {
    await this.prismaService.category.delete({ where: { id } });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private mapCategorySummery(category: Category): CategorySummery {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    } satisfies CategorySummery;
  }
}
