import type {
  Product,
  ProductExtra,
  ProductImage,
  ProductVariant,
} from 'src/generated/prisma/client';
import {
  DetailedProductDto,
  MinimalProductDto,
  ProductExtraDto,
  ProductImageDto,
  ProductVariantDto,
} from './dto/product-response.dto';

export class ProductMapper {
  public static toMinimalProductDto(
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

  public static toMinimalProductsDto(
    products: (Product & {
      variants: Pick<ProductVariant, 'price'>[];
      images: Pick<ProductImage, 'url'>[];
    })[],
  ): MinimalProductDto[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return products.map(ProductMapper.toMinimalProductDto);
  }

  public static toProductVariantDto(
    variant: ProductVariant,
  ): ProductVariantDto {
    const res = new ProductVariantDto();

    res.name = variant.name;
    res.price = variant.price.toString();
    res.isAvailable = variant.isAvailable;
    res.sku = variant.sku ?? null;
    res.createdAt = variant.createdAt.toISOString();
    res.updatedAt = variant.updatedAt.toISOString();

    return res;
  }

  public static toProductVariantsDto(
    variants: ProductVariant[],
  ): ProductVariantDto[] {
    return variants.map((v) => ProductMapper.toProductVariantDto(v));
  }

  public static toProductExtraDto(extra: ProductExtra): ProductExtraDto {
    const res = new ProductExtraDto();

    res.name = extra.name;
    res.price = extra.price.toString();
    res.isAvailable = extra.isAvailable;
    res.sku = extra.sku ?? null;
    res.createdAt = extra.createdAt.toISOString();
    res.updatedAt = extra.updatedAt.toISOString();

    return res;
  }

  public static toProductExtrasDto(extras: ProductExtra[]): ProductExtraDto[] {
    return extras.map((v) => ProductMapper.toProductExtraDto(v));
  }

  public static toProductImageDto(image: ProductImage): ProductImageDto {
    const res = new ProductImageDto();

    res.url = image.url;
    res.isPrimary = image.isPrimary;
    res.createdAt = image.createdAt.toISOString();
    res.updatedAt = image.updatedAt.toISOString();

    return res;
  }

  public static toProductImagesDto(images: ProductImage[]): ProductImageDto[] {
    return images.map((v) => ProductMapper.toProductImageDto(v));
  }

  public static toDetailedProductDto(
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
    res.variants = ProductMapper.toProductVariantsDto(product.variants);
    res.extras = ProductMapper.toProductExtrasDto(product.extras);
    res.images = ProductMapper.toProductImagesDto(product.images);

    return res;
  }

  public static toDetailedProductsDto(
    products: (Product & {
      variants: ProductVariant[];
      extras: ProductExtra[];
      images: ProductImage[];
    })[],
  ): DetailedProductDto[] {
    return products.map((p) => ProductMapper.toDetailedProductDto(p));
  }
}
