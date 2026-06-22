import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  Nullable,
  ProductDetail,
  ProductExtra,
  ProductImage,
  ProductSummery,
  ProductVariant,
} from '@repo/shared';
import {
  type RawProductDetail,
  type RawProductSummery,
  productDetailQuery,
  productSummeryQuery,
} from './product.queries';
import { ProductNotFoundException } from 'src/common/exceptions';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOne(id: string): Promise<ProductDetail> {
    const product: Nullable<RawProductDetail> =
      await this.prismaService.product.findUnique({
        where: { id },
        ...productDetailQuery,
      });

    if (!product) throw new ProductNotFoundException();

    return this.mapProductDetail(product);
  }

  public async findOneBySlug(slug: string): Promise<ProductDetail> {
    const product: Nullable<RawProductDetail> =
      await this.prismaService.product.findUnique({
        where: { slug },
        ...productDetailQuery,
      });

    if (!product) throw new ProductNotFoundException();

    return this.mapProductDetail(product);
  }

  public async findBestSellers(): Promise<ProductSummery[]> {
    // this is placeholder
    const products: RawProductSummery[] =
      await this.prismaService.product.findMany({
        take: 3,
        orderBy: {
          name: 'asc',
        },
        ...productSummeryQuery,
      });

    return products.map((product) => this.mapProductSummery(product));
  }

  public async findLatestProduct(): Promise<ProductSummery[]> {
    // this is placeholder
    const products = await this.prismaService.product.findMany({
      take: 3,
      orderBy: {
        updatedAt: 'asc',
      },
      ...productSummeryQuery,
    });

    return products.map((product) => this.mapProductSummery(product));
  }

  public async findAllProducts(): Promise<ProductSummery[]> {
    const products = await this.prismaService.product.findMany({
      orderBy: {
        updatedAt: 'asc',
      },
      ...productSummeryQuery,
    });

    return products.map((product) => this.mapProductSummery(product));
  }

  public async findCategoryProducts(
    categoryId: string,
  ): Promise<ProductSummery[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          some: { categoryId: categoryId },
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
      ...productSummeryQuery,
    });

    return products.map((product) => this.mapProductSummery(product));
  }

  private mapProductSummery(product: RawProductSummery): ProductSummery {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.variants[0]?.price.toNumber() ?? 0,
      imageUrl: product.images[0]?.url ?? undefined,
    } satisfies ProductSummery;
  }

  private mapProductDetail(product: RawProductDetail): ProductDetail {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      variants: product.variants.map<ProductVariant>((v) => ({
        id: v.id,
        name: v.name,
        price: v.price.toNumber(),
        sku: v.sku,
        isAvailable: v.isAvailable,
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      })),
      extras: product.extras.map<ProductExtra>((e) => ({
        id: e.id,
        name: e.name,
        price: e.price.toNumber(),
        sku: e.sku,
        isAvailable: e.isAvailable,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
      images: product.images.map<ProductImage>((i) => ({
        id: i.id,
        url: i.url,
        isPrimary: i.isPrimary,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    } satisfies ProductDetail;
  }
}
