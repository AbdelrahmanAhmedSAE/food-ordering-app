import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  MinimalProductDto,
  DetailedProductDto,
  ProductExtraDto,
  ProductImageDto,
  ProductVariantDto,
} from './dto/product-response.dto';
import ApiResponse from 'src/lib/response';
import {
  Product,
  ProductVariant,
  ProductImage,
  ProductExtra,
} from 'src/generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOne(id: string): Promise<ApiResponse<DetailedProductDto>> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        variants: true,
        extras: true,
        images: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return new ApiResponse(this.toDetailedProductDto(product));
  }

  public async findOneBySlug(
    slug: string,
  ): Promise<ApiResponse<DetailedProductDto>> {
    const product = await this.prismaService.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        extras: true,
        images: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return new ApiResponse(this.toDetailedProductDto(product));
  }

  public async findBestSellers(): Promise<ApiResponse<MinimalProductDto[]>> {
    // this is placeholder
    const product = await this.prismaService.product.findMany({
      take: 3,
      orderBy: {
        name: 'asc',
      },
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
    });

    return new ApiResponse(this.toMinimalProductsDto(product));
  }

  public async findLatestProduct(): Promise<ApiResponse<MinimalProductDto[]>> {
    // this is placeholder
    const products = await this.prismaService.product.findMany({
      take: 3,
      orderBy: {
        updatedAt: 'asc',
      },
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
    });

    return new ApiResponse(this.toMinimalProductsDto(products));
  }

  public async findAllProducts() {
    const products = await this.prismaService.product.findMany({
      orderBy: {
        updatedAt: 'asc',
      },
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
    });

    return new ApiResponse(this.toMinimalProductsDto(products)).addMeta(
      'message',
      'Products fetched successfully',
    );
  }

  public async findCategoryProducts(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          some: { categoryId: categoryId },
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
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
    });

    return new ApiResponse(this.toMinimalProductsDto(products)).addMeta(
      'message',
      'Products fetched successfully',
    );
  }

  private toMinimalProductDto(
    product: Product & {
      variants: Pick<ProductVariant, 'price'>[];
      images: Pick<ProductImage, 'url'>[];
    },
  ): MinimalProductDto {
    const res = new MinimalProductDto();

    res.id = product.id;
    res.name = product.name;
    res.slug = product.slug;
    res.imageUrl = product.images[0]?.url ?? null;
    res.price = product.variants[0]?.price.toString() ?? '0';

    return res;
  }

  private toMinimalProductsDto(
    products: (Product & {
      variants: Pick<ProductVariant, 'price'>[];
      images: Pick<ProductImage, 'url'>[];
    })[],
  ): MinimalProductDto[] {
    return products.map((p) => this.toMinimalProductDto(p));
  }

  private toProductVariantDto(variant: ProductVariant): ProductVariantDto {
    const res = new ProductVariantDto();

    res.id = variant.id;
    res.name = variant.name;
    res.price = variant.price.toString();
    res.isAvailable = variant.isAvailable;
    res.sku = variant.sku ?? null;
    res.createdAt = variant.createdAt.toISOString();
    res.updatedAt = variant.updatedAt.toISOString();

    return res;
  }

  private toProductVariantsDto(
    variants: ProductVariant[],
  ): ProductVariantDto[] {
    return variants.map((v) => this.toProductVariantDto(v));
  }

  private toProductExtraDto(extra: ProductExtra): ProductExtraDto {
    const res = new ProductExtraDto();

    res.id = extra.id;
    res.name = extra.name;
    res.price = extra.price.toString();
    res.isAvailable = extra.isAvailable;
    res.sku = extra.sku ?? null;
    res.createdAt = extra.createdAt.toISOString();
    res.updatedAt = extra.updatedAt.toISOString();

    return res;
  }

  private toProductExtrasDto(extras: ProductExtra[]): ProductExtraDto[] {
    return extras.map((v) => this.toProductExtraDto(v));
  }

  private toProductImageDto(image: ProductImage): ProductImageDto {
    const res = new ProductImageDto();

    res.url = image.url;
    res.isPrimary = image.isPrimary;
    res.createdAt = image.createdAt.toISOString();
    res.updatedAt = image.updatedAt.toISOString();

    return res;
  }

  private toProductImagesDto(images: ProductImage[]): ProductImageDto[] {
    return images.map((v) => this.toProductImageDto(v));
  }

  private toDetailedProductDto(
    product: Product & {
      variants: ProductVariant[];
      extras: ProductExtra[];
      images: ProductImage[];
    },
  ): DetailedProductDto {
    const res = new DetailedProductDto();

    res.id = product.id;
    res.name = product.name;
    res.slug = product.slug;
    res.createdAt = product.createdAt.toISOString();
    res.updatedAt = product.updatedAt.toISOString();
    res.variants = this.toProductVariantsDto(product.variants);
    res.extras = this.toProductExtrasDto(product.extras);
    res.images = this.toProductImagesDto(product.images);

    return res;
  }
}
