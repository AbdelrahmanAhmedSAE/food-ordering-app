import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import type { RawProductDetail, RawProductSummery } from './product.queries';
import { Decimal } from '@prisma/client/runtime/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const decimal = (value: number) => ({ toNumber: () => value }) as Decimal;

const ISO_DATE = new Date('2024-01-01T00:00:00.000Z');

const makeRawProductSummery = (
  overrides: Partial<RawProductSummery> = {},
): RawProductSummery =>
  ({
    id: 'product-1',
    name: 'Burger',
    slug: 'burger',
    variants: [{ price: decimal(25.0) }],
    images: [{ url: 'https://example.com/burger.jpg' }],
    ...overrides,
  }) as unknown as RawProductSummery;

const makeRawProductDetail = (
  overrides: Partial<RawProductDetail> = {},
): RawProductDetail =>
  ({
    id: 'product-1',
    name: 'Burger',
    slug: 'burger',
    description: 'A delicious burger',
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
    variants: [
      {
        id: 'variant-1',
        name: 'Large',
        price: decimal(25.0),
        sku: 'BUR-L',
        isAvailable: true,
        createdAt: ISO_DATE,
        updatedAt: ISO_DATE,
      },
    ],
    extras: [
      {
        id: 'extra-1',
        name: 'Extra Cheese',
        price: decimal(5.0),
        sku: 'EXT-CHE',
        isAvailable: true,
        createdAt: ISO_DATE,
        updatedAt: ISO_DATE,
      },
    ],
    images: [
      {
        id: 'image-1',
        url: 'https://example.com/burger.jpg',
        isPrimary: true,
        createdAt: ISO_DATE,
        updatedAt: ISO_DATE,
      },
    ],
    ...overrides,
  }) as unknown as RawProductDetail;

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    vi.clearAllMocks();
  });

  // ── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a mapped product when found by id', async () => {
      prismaMock.product.findUnique.mockResolvedValue(makeRawProductDetail());

      const result = await service.findOne('product-1');

      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'product-1' } }),
      );
      expect(result.id).toBe('product-1');
      expect(result.name).toBe('Burger');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        new NotFoundException('Product not found'),
      );
    });
  });

  // ── findOneBySlug ───────────────────────────────────────────────────────────

  describe('findOneBySlug', () => {
    it('should return a mapped product when found by slug', async () => {
      prismaMock.product.findUnique.mockResolvedValue(makeRawProductDetail());

      const result = await service.findOneBySlug('burger');

      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'burger' } }),
      );
      expect(result.slug).toBe('burger');
    });

    it('should throw NotFoundException when slug does not match any product', async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(service.findOneBySlug('nonexistent-slug')).rejects.toThrow(
        new NotFoundException('Product not found'),
      );
    });
  });

  // ── findBestSellers ─────────────────────────────────────────────────────────

  describe('findBestSellers', () => {
    it('should return up to 3 products ordered by name', async () => {
      prismaMock.product.findMany.mockResolvedValue([makeRawProductSummery()]);

      const result = await service.findBestSellers();

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
          orderBy: { name: 'asc' },
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('should return an empty array when no products exist', async () => {
      prismaMock.product.findMany.mockResolvedValue([]);

      const result = await service.findBestSellers();

      expect(result).toEqual([]);
    });
  });

  // ── findLatestProduct ───────────────────────────────────────────────────────

  describe('findLatestProduct', () => {
    it('should return up to 3 products ordered by updatedAt', async () => {
      prismaMock.product.findMany.mockResolvedValue([makeRawProductSummery()]);

      const result = await service.findLatestProduct();

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
          orderBy: { updatedAt: 'asc' },
        }),
      );
      expect(result).toHaveLength(1);
    });
  });

  // ── findAllProducts ─────────────────────────────────────────────────────────

  describe('findAllProducts', () => {
    it('should return all products without a take limit', async () => {
      prismaMock.product.findMany.mockResolvedValue([
        makeRawProductSummery(),
        makeRawProductSummery({ id: 'product-2', name: 'Pizza' }),
      ]);

      const result = await service.findAllProducts();

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expect.not.objectContaining({ take: expect.anything() }),
      );
      expect(result).toHaveLength(2);
    });
  });

  // ── findCategoryProducts ────────────────────────────────────────────────────

  describe('findCategoryProducts', () => {
    it('should filter products by categoryId', async () => {
      prismaMock.product.findMany.mockResolvedValue([makeRawProductSummery()]);

      const result = await service.findCategoryProducts('category-1');

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            category: {
              some: { categoryId: 'category-1' },
            },
          },
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('should return an empty array when category has no products', async () => {
      prismaMock.product.findMany.mockResolvedValue([]);

      const result = await service.findCategoryProducts('empty-category');

      expect(result).toEqual([]);
    });
  });

  // ── toProductSummery (mapping, tested via public methods) ─────────────────

  describe('product summary mapping', () => {
    it('should take the price from the first variant', async () => {
      const raw = makeRawProductSummery({
        variants: [{ price: decimal(15.5) }, { price: decimal(99.0) }],
      });
      prismaMock.product.findMany.mockResolvedValue([raw]);

      const [result] = await service.findAllProducts();

      expect(result.price).toBe(15.5);
    });

    it('should take the url from the first image', async () => {
      const raw = makeRawProductSummery({
        images: [
          { url: 'https://example.com/first.jpg' },
          { url: 'https://example.com/second.jpg' },
        ],
      });
      prismaMock.product.findMany.mockResolvedValue([raw]);

      const [result] = await service.findAllProducts();

      expect(result.imageUrl).toBe('https://example.com/first.jpg');
    });
  });

  // ── toProductDetail (mapping, tested via public methods) ───────────────────

  describe('product detail mapping', () => {
    it('should convert all Decimal prices to numbers', async () => {
      prismaMock.product.findUnique.mockResolvedValue(makeRawProductDetail());

      const result = await service.findOne('product-1');

      expect(result.variants[0].price).toBe(25.0);
      expect(result.extras[0].price).toBe(5.0);
      expect(typeof result.variants[0].price).toBe('number');
      expect(typeof result.extras[0].price).toBe('number');
    });

    it('should convert all dates to ISO strings', async () => {
      prismaMock.product.findUnique.mockResolvedValue(makeRawProductDetail());

      const result = await service.findOne('product-1');

      expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.variants[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.extras[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.images[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should map all variants, extras, and images arrays', async () => {
      const raw = makeRawProductDetail({
        variants: [
          {
            id: 'variant-1',
            name: 'Small',
            price: decimal(20.0),
            sku: 'BUR-S',
            isAvailable: true,
            createdAt: ISO_DATE,
            updatedAt: ISO_DATE,
          },
          {
            id: 'variant-2',
            name: 'Large',
            price: decimal(28.0),
            sku: 'BUR-L',
            isAvailable: true,
            createdAt: ISO_DATE,
            updatedAt: ISO_DATE,
          },
        ],
      });
      prismaMock.product.findUnique.mockResolvedValue(raw);

      const result = await service.findOne('product-1');

      expect(result.variants).toHaveLength(2);
      expect(result.variants[1].name).toBe('Large');
    });

    it('should handle a product with no extras', async () => {
      const raw = makeRawProductDetail({ extras: [] });
      prismaMock.product.findUnique.mockResolvedValue(raw);

      const result = await service.findOne('product-1');

      expect(result.extras).toEqual([]);
    });

    it('should preserve isAvailable flag for variants and extras', async () => {
      const raw = makeRawProductDetail({
        variants: [
          {
            id: 'variant-1',
            name: 'Large',
            price: decimal(25.0),
            sku: 'BUR-L',
            isAvailable: false,
            createdAt: ISO_DATE,
            updatedAt: ISO_DATE,
          },
        ],
      });
      prismaMock.product.findUnique.mockResolvedValue(raw);

      const result = await service.findOne('product-1');

      expect(result.variants[0].isAvailable).toBe(false);
    });
  });
});
