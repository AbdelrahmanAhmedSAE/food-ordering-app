import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from 'src/generated/prisma/client';
import ApiResponse from 'src/lib/response';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (category) throw new BadRequestException('Category already exits');

    const slug = this.generateSlug(createCategoryDto.name);
    return this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
      },
    });
  }

  public async findAll(include: string) {
    switch (include) {
      case 'products': {
        const dbCategories = await this.prismaService.category.findMany({
          include: {
            productCategories: {
              include: { product: true },
            },
          },
        });

        const categories = dbCategories.map((c) => {
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            products: c.productCategories.map((pc) => pc.product),
          };
        });

        return new ApiResponse(categories).addMeta(
          'message',
          'Categories fetched successfully',
        );
      }
      case 'details': {
        const categories = await this.prismaService.category.findMany();

        return new ApiResponse(categories).addMeta(
          'message',
          'Categories fetched successfully',
        );
      }

      default: {
        const categories = await this.prismaService.category.findMany({
          select: { id: true, name: true },
        });

        return new ApiResponse(categories).addMeta(
          'message',
          'Categories fetched successfully',
        );
      }
    }
  }

  public async findOne(id: string, include: string) {
    if (include == 'products') {
      const dbCategory = await this.prismaService.category.findUnique({
        where: { id },
        include: {
          productCategories: {
            include: { product: true },
          },
        },
      });

      if (!dbCategory) throw new NotFoundException('Category Not Found');

      return new ApiResponse({
        id: dbCategory.id,
        name: dbCategory.name,
        slug: dbCategory.slug,
        products: dbCategory.productCategories.map((pc) => pc.product),
      }).addMeta('message', 'Category fetched successfully');
    }

    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category Not Found');

    return new ApiResponse(category).addMeta(
      'message',
      'Category fetched successfully',
    );
  }

  public async setInactive(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category Not Found');

    return this.prismaService.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  public async setActive(id: string): Promise<Category> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category Not Found');

    return this.prismaService.category.update({
      where: { id },
      data: { isActive: true },
    });
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
}
