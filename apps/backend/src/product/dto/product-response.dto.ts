class Dated {
  createdAt: string;
  updatedAt: string;
}

export class MinimalProductDto {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: string;
}

export class ProductVariantDto extends Dated {
  name: string;
  price: string;
  isAvailable: boolean;
  sku: string | null;
}

export class ProductExtraDto extends Dated {
  name: string;
  price: string;
  isAvailable: boolean;
  sku: string | null;
}

export class ProductImageDto extends Dated {
  url: string;
  isPrimary: boolean;
}

export class DetailedProductDto extends Dated {
  id: string;
  name: string;
  slug: string;

  variants: ProductVariantDto[];
  extras: ProductExtraDto[];
  images: ProductImageDto[];
}
