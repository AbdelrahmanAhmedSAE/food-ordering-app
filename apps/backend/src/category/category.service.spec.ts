import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Category } from 'src/generated/prisma/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ISO_DATE = new Date('2024-01-01T00:00:00.000Z');

const makeCategory = (overrides: Partial<Category> = {}): Category =>
  ({
    id: 'category-1',
    name: 'Fast Food',
    slug: 'fast-food',
    isActive: true,
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
    ...overrides,
  }) as unknown as Category;

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  category: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    vi.clearAllMocks();
  });

  // ── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a new category with a generated slug', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);
      prismaMock.category.create.mockResolvedValue(
        makeCategory({ name: 'Fast Food', slug: 'fast-food' }),
      );

      const result = await service.create({ name: 'Fast Food' });

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { name: 'Fast Food' },
      });
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { name: 'Fast Food', slug: 'fast-food' },
      });
      expect(result.slug).toBe('fast-food');
    });

    it('should throw BadRequestException when category name already exists', async () => {
      prismaMock.category.findUnique.mockResolvedValue(makeCategory());

      await expect(service.create({ name: 'Fast Food' })).rejects.toThrow(
        new BadRequestException('Category already exits'),
      );

      expect(prismaMock.category.create).not.toHaveBeenCalled();
    });
  });

  // ── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all categories mapped to CategorySummery', async () => {
      prismaMock.category.findMany.mockResolvedValue([
        makeCategory({ id: 'cat-1' }),
        makeCategory({ id: 'cat-2', name: 'Desserts', slug: 'desserts' }),
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[1].name).toBe('Desserts');
    });

    it('should return an empty array when there are no categories', async () => {
      prismaMock.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a mapped category when found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(makeCategory());

      const result = await service.findOne('category-1');

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'category-1' },
      });
      expect(result.id).toBe('category-1');
    });

    it('should throw NotFoundException when category does not exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        new NotFoundException('Category Not Found'),
      );
    });
  });

  // ── setInactive ─────────────────────────────────────────────────────────────

  describe('setInactive', () => {
    it('should set isActive to false', async () => {
      prismaMock.category.findUnique.mockResolvedValue(makeCategory());
      prismaMock.category.update.mockResolvedValue(
        makeCategory({ isActive: false }),
      );

      const result = await service.setInactive('category-1');

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(service.setInactive('nonexistent')).rejects.toThrow(
        new NotFoundException('Category Not Found'),
      );

      expect(prismaMock.category.update).not.toHaveBeenCalled();
    });
  });

  // ── setActive ───────────────────────────────────────────────────────────────

  describe('setActive', () => {
    it('should set isActive to true', async () => {
      prismaMock.category.findUnique.mockResolvedValue(
        makeCategory({ isActive: false }),
      );
      prismaMock.category.update.mockResolvedValue(
        makeCategory({ isActive: true }),
      );

      const result = await service.setActive('category-1');

      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      await expect(service.setActive('nonexistent')).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMock.category.update).not.toHaveBeenCalled();
    });
  });

  // ── remove ──────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete the category by id', async () => {
      prismaMock.category.delete.mockResolvedValue(makeCategory());

      await service.remove('category-1');

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 'category-1' },
      });
    });
  });

  // ── generateSlug (private — tested indirectly via create) ──────────────────

  describe('slug generation', () => {
    const expectSlug = async (name: string, expectedSlug: string) => {
      prismaMock.category.findUnique.mockResolvedValue(null);
      prismaMock.category.create.mockImplementation(
        (args: { data: { name: string; slug: string } }) =>
          Promise.resolve(
            makeCategory({ name: args.data.name, slug: args.data.slug }),
          ),
      );

      const result = await service.create({ name });
      expect(result.slug).toBe(expectedSlug);
    };

    it('should lowercase the name', async () => {
      await expectSlug('FAST FOOD', 'fast-food');
    });

    it('should trim leading and trailing whitespace', async () => {
      await expectSlug('  Desserts  ', 'desserts');
    });

    it('should replace multiple spaces with a single dash', async () => {
      await expectSlug('Fast    Food', 'fast-food');
    });

    it('should remove special characters', async () => {
      await expectSlug('Fast & Food!', 'fast--food');
    });

    it('should handle names that are already valid slugs', async () => {
      await expectSlug('drinks', 'drinks');
    });

    it('should handle names with numbers', async () => {
      await expectSlug('Top 10 Burgers', 'top-10-burgers');
    });

    it('should handle a single word', async () => {
      await expectSlug('Pizza', 'pizza');
    });
  });
});
