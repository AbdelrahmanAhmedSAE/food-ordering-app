interface Dated {
  createdAt: string;
  updatedAt: string;
}

export interface MinimalProductDto {
  id: string;
  name: string;
  slug: string;
  /** @nullable */
  imageUrl: string | null;
  price: string;
}

export interface ProductVariantDto extends Dated {
  name: string;
  price: string;
  isAvailable: boolean;
  sku: string | null;
}

export interface ProductExtraDto extends Dated {
  name: string;
  price: string;
  isAvailable: boolean;
  sku: string | null;
}

export interface ProductImageDto extends Dated {
  url: string;
  isPrimary: boolean;
}

export interface ProductDto extends Dated {
  id: string;
  name: string;
  slug: string;

  variants: ProductVariantDto[];
  extras: ProductExtraDto[];
  images: ProductImageDto[];
}
