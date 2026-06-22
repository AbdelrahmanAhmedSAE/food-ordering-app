interface IProduct {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummery
  extends Omit<IProduct, "createdAt" | "updatedAt"> {
  slug: string;
  imageUrl: string | null;
  price: number;
}

export interface ProductDetail extends IProduct {
  description: string;
  slug: string;

  variants: ProductVariant[];
  images: ProductImage[];
  extras: ProductExtra[];
}

export interface ProductVariant extends IProduct {
  price: number;
  isAvailable: boolean;
  sku: string | null;
}

export interface ProductExtra extends IProduct {
  price: number;
  isAvailable: boolean;
  sku: string | null;
}

export interface ProductImage extends Omit<IProduct, "name"> {
  url: string;
  isPrimary: boolean;
}
