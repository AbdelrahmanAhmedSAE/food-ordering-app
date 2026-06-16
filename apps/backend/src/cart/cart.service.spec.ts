import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import type { RawCartDetail } from './cart.queries';
import type { User } from 'src/generated/prisma/client';
import type { CartDetail } from '@app/shared';
import { Decimal } from '@prisma/client/runtime/client';

const decimal = (value: number): Decimal =>
  ({
    toNumber: () => value,
  }) as Decimal;

const makeRawCart = (overrides: Partial<RawCartDetail> = {}): RawCartDetail =>
  ({
    id: 'cart-1',
    userId: 'user-1',
    totalPrice: decimal(50.0),
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    cartItems: [
      {
        id: 'item-1',
        cartId: 'cart-1',
        quantity: 2,
        totalPrice: decimal(50.0),
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        productVariant: {
          id: 'variant-1',
          name: 'Large',
          price: decimal(25.0),
          product: {
            name: 'Burger',
            images: [{ url: 'https://example.com/burger.jpg' }],
          },
        },
        cartItemExtras: [
          {
            id: 'extra-1',
            cartItemId: 'item-1',
            quantity: 1,
            totalPrice: decimal(5.0),
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
            productExtra: {
              id: 'product-extra-1',
              name: 'Extra Cheese',
              price: decimal(5.0),
            },
          },
        ],
      },
    ],
    ...overrides,
  }) as RawCartDetail;

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    name: 'Ahmed',
    email: 'ahmed@test.com',
    ...overrides,
  }) as User;

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  user: { findUnique: vi.fn() },
  cart: { create: vi.fn(), findUnique: vi.fn() },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    vi.clearAllMocks();
  });

  // ── createCart ──────────────────────────────────────────────────────────────

  describe('createCart', () => {
    it('should create and return a mapped cart when user exists', async () => {
      const user = makeUser();
      const rawCart = makeRawCart();

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.cart.create.mockResolvedValue(rawCart);

      const result = await service.createCart('user-1');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });

      expect(prismaMock.cart.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: 'user-1' } }),
      );

      expect(result).toMatchObject<Partial<CartDetail>>({
        id: 'cart-1',
        userId: 'user-1',
        totalPrice: 50.0,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.createCart('nonexistent-user')).rejects.toThrow(
        new NotFoundException('User not found'),
      );

      expect(prismaMock.cart.create).not.toHaveBeenCalled();
    });
  });

  // ── findCartByUserId ────────────────────────────────────────────────────────

  describe('findCartByUserId', () => {
    it('should return a mapped cart when cart exists', async () => {
      const rawCart = makeRawCart();
      prismaMock.cart.findUnique.mockResolvedValue(rawCart);

      const result = await service.findCartByUserId('user-1');

      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
      expect(result.id).toBe('cart-1');
    });

    it('should throw NotFoundException when cart does not exist', async () => {
      prismaMock.cart.findUnique.mockResolvedValue(null);

      await expect(service.findCartByUserId('user-1')).rejects.toThrow(
        new NotFoundException('Cart not found'),
      );
    });
  });

  // ── mapCart ─────────────────────────────────────────────────────────────────

  describe('mapCart', () => {
    it('should convert Decimal totalPrice to number', () => {
      const rawCart = makeRawCart({ totalPrice: decimal(99.99) });

      const result = service.mapCart(rawCart);

      expect(result.totalPrice).toBe(99.99);
      expect(typeof result.totalPrice).toBe('number');
    });

    it('should convert dates to ISO strings', () => {
      const date = new Date('2024-06-01T10:00:00.000Z');
      const rawCart = makeRawCart({ createdAt: date, updatedAt: date });

      const result = service.mapCart(rawCart);

      expect(result.createdAt).toBe('2024-06-01T10:00:00.000Z');
      expect(result.updatedAt).toBe('2024-06-01T10:00:00.000Z');
    });

    it('should map cartItems correctly', () => {
      const rawCart = makeRawCart();

      const result = service.mapCart(rawCart);

      expect(result.cartItems).toHaveLength(1);
      expect(result.cartItems[0]).toMatchObject({
        id: 'item-1',
        quantity: 2,
        totalPrice: 50.0,
        productName: 'Burger',
        productVariant: {
          id: 'variant-1',
          name: 'Large',
          price: 25.0,
          image: { url: 'https://example.com/burger.jpg' },
        },
      });
    });

    it('should map cartItemExtras correctly', () => {
      const rawCart = makeRawCart();

      const result = service.mapCart(rawCart);

      expect(result.cartItems[0].cartItemExtras).toHaveLength(1);
      expect(result.cartItems[0].cartItemExtras[0]).toMatchObject({
        id: 'extra-1',
        quantity: 1,
        totalPrice: 5.0,
        productExtra: {
          id: 'product-extra-1',
          name: 'Extra Cheese',
          price: 5.0,
        },
      });
    });

    it('should handle cart with no items', () => {
      const rawCart = makeRawCart({ cartItems: [] });

      const result = service.mapCart(rawCart);

      expect(result.cartItems).toEqual([]);
    });

    it('should handle cart item with no extras', () => {
      const rawCart = makeRawCart({
        cartItems: [
          {
            ...makeRawCart().cartItems[0],
            cartItemExtras: [],
          },
        ],
      });

      const result = service.mapCart(rawCart);

      expect(result.cartItems[0].cartItemExtras).toEqual([]);
    });
  });
});
