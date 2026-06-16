import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CartItemService } from './cart-item.service';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import type {
  ProductVariant,
  ProductExtra,
  Cart,
} from 'src/generated/prisma/client';
import type { CreateCartItemDto } from './dto/create-cart-item.dto';
import type { RawCartDetail } from './cart.queries';
import { Decimal } from '@prisma/client/runtime/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const decimal = (value: number) => ({ toNumber: () => value }) as Decimal;

const makeProductVariant = (
  overrides: Partial<ProductVariant> = {},
): ProductVariant =>
  ({
    id: 'variant-1',
    productId: 'product-1',
    price: decimal(25.0),
    isAvailable: true,
    ...overrides,
  }) as unknown as ProductVariant;

const makeProductExtra = (
  overrides: Partial<ProductExtra> = {},
): ProductExtra =>
  ({
    id: 'extra-1',
    productId: 'product-1',
    name: 'Extra Cheese',
    price: decimal(5.0),
    ...overrides,
  }) as unknown as ProductExtra;

const makeCart = (overrides: Partial<Cart> = {}): Cart =>
  ({
    id: 'cart-1',
    userId: 'user-1',
    totalPrice: decimal(0),
    ...overrides,
  }) as unknown as Cart;

const makeRawCart = (): RawCartDetail => ({
  id: 'cart-1',
  userId: 'user-1',
  totalPrice: decimal(50.0),
  createdAt: new Date(),
  updatedAt: new Date(),
  cartItems: [],
});

// ── Transaction mock factory ──────────────────────────────────────────────────
const makeTxMock = () => ({
  cart: {
    upsert: vi.fn().mockResolvedValue(makeCart()),
  },
  cartItem: {
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
  },
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  productVariant: { findUnique: vi.fn() },
  productExtra: { findMany: vi.fn() },
  cartItem: { delete: vi.fn() },
  cart: { update: vi.fn() },
  $transaction: vi.fn(),
};

const cartServiceMock = {
  mapCart: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CartItemService', () => {
  let service: CartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: CartService, useValue: cartServiceMock },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    vi.clearAllMocks();
  });

  // ── addItemToCart ───────────────────────────────────────────────────────────

  describe('addItemToCart', () => {
    const dto: CreateCartItemDto = {
      productVariantId: 'variant-1',
      quantity: 2,
      extras: [{ extraId: 'extra-1', quantity: 1 }],
    };

    const setupHappyPath = (txMock = makeTxMock()) => {
      prismaMock.productVariant.findUnique.mockResolvedValue(
        makeProductVariant(),
      );
      prismaMock.productExtra.findMany.mockResolvedValue([makeProductExtra()]);
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<void>) => cb(txMock),
      );
      prismaMock.cart.update.mockResolvedValue(makeRawCart());
      cartServiceMock.mapCart.mockReturnValue({ id: 'cart-1', cartItems: [] });
      return txMock;
    };

    it('should add a new item and return mapped cart', async () => {
      setupHappyPath();

      const result = await service.addItemToCart('user-1', dto);

      expect(prismaMock.productVariant.findUnique).toHaveBeenCalledWith({
        where: { id: dto.productVariantId },
      });
      expect(prismaMock.productExtra.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['extra-1'] },
          productId: 'product-1',
        },
      });
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.update).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.mapCart).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when product variant does not exist', async () => {
      prismaMock.productVariant.findUnique.mockResolvedValue(null);

      await expect(service.addItemToCart('user-1', dto)).rejects.toThrow(
        new BadRequestException('This product variant currently unavailable'),
      );

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when product variant is not available', async () => {
      prismaMock.productVariant.findUnique.mockResolvedValue(
        makeProductVariant({ isAvailable: false }),
      );

      await expect(service.addItemToCart('user-1', dto)).rejects.toThrow(
        new BadRequestException('This product variant currently unavailable'),
      );
    });

    it('should throw BadRequestException when extras are invalid', async () => {
      prismaMock.productVariant.findUnique.mockResolvedValue(
        makeProductVariant(),
      );
      prismaMock.productExtra.findMany.mockResolvedValue([]);

      await expect(service.addItemToCart('user-1', dto)).rejects.toThrow(
        new BadRequestException('One or more extras are invalid'),
      );

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('should work with no extras', async () => {
      const dtoWithoutExtras: CreateCartItemDto = {
        productVariantId: 'variant-1',
        quantity: 1,
        extras: [],
      };

      prismaMock.productVariant.findUnique.mockResolvedValue(
        makeProductVariant(),
      );
      prismaMock.productExtra.findMany.mockResolvedValue([]);
      const txMock = makeTxMock();
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<void>) => cb(txMock),
      );
      prismaMock.cart.update.mockResolvedValue(makeRawCart());
      cartServiceMock.mapCart.mockReturnValue({ id: 'cart-1', cartItems: [] });

      await service.addItemToCart('user-1', dtoWithoutExtras);

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should increment quantity when item already exists in cart', async () => {
      const existingItem = {
        id: 'item-1',
        quantity: 1,
        totalPrice: decimal(25.0),
      };

      const txMock = makeTxMock();
      txMock.cartItem.findUnique.mockResolvedValue(existingItem);
      setupHappyPath(txMock);

      await service.addItemToCart('user-1', dto);

      expect(txMock.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: existingItem.id },
          data: expect.objectContaining({
            quantity: { increment: dto.quantity },
          }) as { increment: number },
        }),
      );
      expect(txMock.cartItem.create).not.toHaveBeenCalled();
    });

    it('should create new item when it does not exist in cart', async () => {
      const txMock = makeTxMock();
      txMock.cartItem.findUnique.mockResolvedValue(null);
      setupHappyPath(txMock);

      await service.addItemToCart('user-1', dto);

      expect(txMock.cartItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            productVariantId: dto.productVariantId,
            quantity: dto.quantity,
          }) as { productVariantId: string; quantity: number },
        }),
      );
      expect(txMock.cartItem.update).not.toHaveBeenCalled();
    });
  });

  // ── deleteCartItem ──────────────────────────────────────────────────────────

  describe('deleteCartItem', () => {
    it('should delete cart item successfully', async () => {
      prismaMock.cartItem.delete.mockResolvedValue({});

      await service.deleteCartItem('user-1', 'item-1');

      expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1', cart: { userId: 'user-1' } },
      });
    });

    it('should throw NotFoundException when cart item does not exist (P2025)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' },
      );
      prismaMock.cartItem.delete.mockRejectedValue(prismaError);

      await expect(
        service.deleteCartItem('user-1', 'nonexistent-item'),
      ).rejects.toThrow(new NotFoundException('Cart item not found'));
    });

    it('should rethrow unknown errors', async () => {
      const unknownError = new Error('Database connection failed');
      prismaMock.cartItem.delete.mockRejectedValue(unknownError);

      await expect(service.deleteCartItem('user-1', 'item-1')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  // ── hashExtras (private — tested indirectly) ────────────────────────────────

  describe('price calculation (via addItemToCart)', () => {
    it('should calculate correct total price: (variantPrice × quantity) + Σ(extraPrice × extraQuantity)', async () => {
      // variant: 25 × 2 = 50, extra: 5 × 3 = 15, total = 65
      const dtoWithMultipleExtras: CreateCartItemDto = {
        productVariantId: 'variant-1',
        quantity: 2,
        extras: [{ extraId: 'extra-1', quantity: 3 }],
      };

      const variant = makeProductVariant({ price: decimal(25.0) }) as {
        price: Decimal;
      };
      const extra = makeProductExtra({ price: decimal(5.0) }) as {
        price: Decimal;
      };

      prismaMock.productVariant.findUnique.mockResolvedValue(variant);
      prismaMock.productExtra.findMany.mockResolvedValue([extra]);

      let capturedTotalPrice: number | undefined;
      const txMock = makeTxMock();
      txMock.cartItem.create.mockImplementation(
        (args: { data: { totalPrice: number } }) => {
          capturedTotalPrice = args.data.totalPrice;
          return Promise.resolve({});
        },
      );

      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<void>) => cb(txMock),
      );
      prismaMock.cart.update.mockResolvedValue(makeRawCart());
      cartServiceMock.mapCart.mockReturnValue({ id: 'cart-1', cartItems: [] });

      await service.addItemToCart('user-1', dtoWithMultipleExtras);

      // 25 × 2 + 5 × 3 = 65
      expect(capturedTotalPrice).toBe(65);
    });

    it('should calculate correct price with no extras', async () => {
      // variant: 25 × 3 = 75
      const dto: CreateCartItemDto = {
        productVariantId: 'variant-1',
        quantity: 3,
        extras: [],
      };

      const variant = makeProductVariant({ price: decimal(25.0) });

      prismaMock.productVariant.findUnique.mockResolvedValue(variant);
      prismaMock.productExtra.findMany.mockResolvedValue([]);

      let capturedTotalPrice: number | undefined;
      const txMock = makeTxMock();
      txMock.cartItem.create.mockImplementation(
        (args: { data: { totalPrice: number } }) => {
          capturedTotalPrice = args.data.totalPrice;
          return Promise.resolve({});
        },
      );

      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<void>) => cb(txMock),
      );
      prismaMock.cart.update.mockResolvedValue(makeRawCart());
      cartServiceMock.mapCart.mockReturnValue({ id: 'cart-1', cartItems: [] });

      await service.addItemToCart('user-1', dto);

      expect(capturedTotalPrice).toBe(75);
    });
  });
});
