import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentService } from 'src/payment/payment.service';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/generated/prisma/enums';
import type { Order } from 'src/generated/prisma/client';
import type { RawOrderDetail } from './order.queries';
import type { CreateOrderDto } from './dto/create-order.dto';

// ── Helpers ───────────────────────────────────────────────────────────────────

const decimal = (value: number) => ({ toNumber: () => value });
const ISO_DATE = new Date('2024-01-01T00:00:00.000Z');

const makeOrder = (overrides: Partial<Order> = {}): Order =>
  ({
    id: 'order-1',
    userId: 'user-1',
    totalPrice: decimal(50.0),
    paymentIntentId: null,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PENDING,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Cairo, Egypt',
    createdAt: ISO_DATE,
    updatedAt: ISO_DATE,
    ...overrides,
  }) as unknown as Order;

const makeCart = (overrides: Record<string, unknown> = {}) => ({
  id: 'cart-1',
  userId: 'user-1',
  totalPrice: decimal(50.0),
  cartItems: [
    {
      id: 'cart-item-1',
      quantity: 2,
      totalPrice: decimal(50.0),
      productVariantId: 'variant-1',
      productVariant: {
        name: 'Large',
        product: { name: 'Burger' },
      },
      cartItemExtras: [
        {
          quantity: 1,
          totalPrice: decimal(5.0),
          productExtraId: 'extra-1',
          productExtra: { name: 'Extra Cheese' },
        },
      ],
    },
  ],
  ...overrides,
});

const makeRawOrderDetail = (
  overrides: Partial<RawOrderDetail> = {},
): RawOrderDetail =>
  ({
    id: 'order-1',
    userId: 'user-1',
    totalPrice: decimal(50.0),
    paymentIntentId: null,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PENDING,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Cairo, Egypt',
    createdAt: ISO_DATE,
    items: [
      {
        id: 'item-1',
        name: 'Burger-Large',
        totalPrice: decimal(50.0),
        quantity: 2,
        orderId: 'order-1',
        createdAt: ISO_DATE,
        orderItemExtras: [
          {
            id: 'extra-1',
            name: 'Extra Cheese',
            totalPrice: decimal(5.0),
            quantity: 1,
            orderItemId: 'item-1',
            createdAt: ISO_DATE,
          },
        ],
      },
    ],
    ...overrides,
  }) as unknown as RawOrderDetail;

// ── Transaction mock ─────────────────────────────────────────────────────────

const makeTxMock = () => ({
  order: {
    create: vi.fn(),
  },
  cartItem: {
    deleteMany: vi.fn().mockResolvedValue({}),
  },
  cart: {
    update: vi.fn().mockResolvedValue({}),
  },
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  cart: { findUnique: vi.fn() },
  order: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
};

const paymentServiceMock = {
  refund: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: PaymentService, useValue: paymentServiceMock },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    vi.clearAllMocks();
  });

  // ── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto: CreateOrderDto = {
      paymentMethod: PaymentMethod.CASH,
      deliveryAddress: 'Cairo, Egypt',
    };

    it('should create an order, clear the cart, and reset cart total', async () => {
      const cart = makeCart();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const txMock = makeTxMock();
      txMock.order.create.mockResolvedValue(makeOrder());
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<unknown>) => cb(txMock),
      );

      const result = await service.create('user-1', dto);

      expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
      expect(txMock.order.create).toHaveBeenCalledTimes(1);
      expect(txMock.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: cart.id },
      });
      expect(txMock.cart.update).toHaveBeenCalledWith({
        where: { id: cart.id },
        data: { totalPrice: 0 },
      });
      expect(result.id).toBe('order-1');
    });

    it('should throw BadRequestException when cart does not exist', async () => {
      prismaMock.cart.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', dto)).rejects.toThrow(
        new BadRequestException('Your cart is empty'),
      );

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when cart has no items', async () => {
      prismaMock.cart.findUnique.mockResolvedValue(makeCart({ cartItems: [] }));

      await expect(service.create('user-1', dto)).rejects.toThrow(
        new BadRequestException('Your cart is empty'),
      );

      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('should build the order item name from product and variant names', async () => {
      const cart = makeCart();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const txMock = makeTxMock();
      let capturedOrderData: any;
      txMock.order.create.mockImplementation((args: any) => {
        capturedOrderData = args.data;
        return Promise.resolve(makeOrder());
      });
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<unknown>) => cb(txMock),
      );

      await service.create('user-1', dto);

      expect(capturedOrderData.items.create[0].name).toBe('Burger-Large');
    });

    it('should map cart item extras into orderItemExtras with correct names', async () => {
      const cart = makeCart();
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const txMock = makeTxMock();
      let capturedOrderData: any;
      txMock.order.create.mockImplementation((args: any) => {
        capturedOrderData = args.data;
        return Promise.resolve(makeOrder());
      });
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<unknown>) => cb(txMock),
      );

      await service.create('user-1', dto);

      const extras = capturedOrderData.items.create[0].orderItemExtras.create;
      expect(extras[0].name).toBe('Extra Cheese');
      expect(extras[0].productExtraId).toBe('extra-1');
    });

    it('should use the cart totalPrice as the order totalPrice', async () => {
      const cart = makeCart({ totalPrice: decimal(123.45) });
      prismaMock.cart.findUnique.mockResolvedValue(cart);

      const txMock = makeTxMock();
      let capturedOrderData: any;
      txMock.order.create.mockImplementation((args: any) => {
        capturedOrderData = args.data;
        return Promise.resolve(makeOrder());
      });
      prismaMock.$transaction.mockImplementation(
        (cb: (tx: typeof txMock) => Promise<unknown>) => cb(txMock),
      );

      await service.create('user-1', dto);

      expect(capturedOrderData.totalPrice).toBe(cart.totalPrice);
    });
  });

  // ── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return mapped order details for the user', async () => {
      prismaMock.order.findMany.mockResolvedValue([makeRawOrderDetail()]);

      const result = await service.findAll('user-1');

      expect(prismaMock.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].items).toHaveLength(1);
      expect(result[0].items[0].extras).toHaveLength(1);
    });

    it('should return an empty array when the user has no orders', async () => {
      prismaMock.order.findMany.mockResolvedValue([]);

      const result = await service.findAll('user-1');

      expect(result).toEqual([]);
    });

    it('should convert all Decimal prices to numbers across nested levels', async () => {
      prismaMock.order.findMany.mockResolvedValue([makeRawOrderDetail()]);

      const [result] = await service.findAll('user-1');

      expect(result.totalPrice).toBe(50.0);
      expect(result.items[0].totalPrice).toBe(50.0);
      expect(result.items[0].extras[0].totalPrice).toBe(5.0);
    });
  });

  // ── cancel ──────────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('should cancel a PENDING order without refund for CASH payment', async () => {
      const order = makeOrder({
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
      });
      prismaMock.order.findUnique.mockResolvedValue(order);
      prismaMock.order.update.mockResolvedValue(
        makeOrder({ status: OrderStatus.CANCELED }),
      );

      const result = await service.cancel('user-1', 'order-1');

      expect(prismaMock.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: OrderStatus.CANCELED },
      });
      expect(paymentServiceMock.refund).not.toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.CANCELED);
    });

    it('should cancel a CONFIRMED order', async () => {
      const order = makeOrder({ status: OrderStatus.CONFIRMED });
      prismaMock.order.findUnique.mockResolvedValue(order);
      prismaMock.order.update.mockResolvedValue(
        makeOrder({ status: OrderStatus.CANCELED }),
      );

      await service.cancel('user-1', 'order-1');

      expect(prismaMock.order.update).toHaveBeenCalled();
    });

    it('should refund the payment when order was paid ONLINE and has a paymentIntentId', async () => {
      const order = makeOrder({
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.ONLINE,
        paymentIntentId: 'pi_123',
      });
      prismaMock.order.findUnique.mockResolvedValue(order);
      prismaMock.order.update.mockResolvedValue(
        makeOrder({ status: OrderStatus.CANCELED }),
      );
      paymentServiceMock.refund.mockResolvedValue({ id: 're_123' });

      await service.cancel('user-1', 'order-1');

      expect(paymentServiceMock.refund).toHaveBeenCalledWith('pi_123');
    });

    it('should NOT refund when payment method is ONLINE but paymentIntentId is missing', async () => {
      const order = makeOrder({
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.ONLINE,
        paymentIntentId: null,
      });
      prismaMock.order.findUnique.mockResolvedValue(order);
      prismaMock.order.update.mockResolvedValue(
        makeOrder({ status: OrderStatus.CANCELED }),
      );

      await service.cancel('user-1', 'order-1');

      expect(paymentServiceMock.refund).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(service.cancel('user-1', 'nonexistent')).rejects.toThrow(
        new NotFoundException('Order not found'),
      );

      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when order is already DELIVERED', async () => {
      const order = makeOrder({ status: OrderStatus.DELIVERED });
      prismaMock.order.findUnique.mockResolvedValue(order);

      await expect(service.cancel('user-1', 'order-1')).rejects.toThrow(
        new BadRequestException("You can't cancel this order"),
      );

      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when order is already CANCELED', async () => {
      const order = makeOrder({ status: OrderStatus.CANCELED });
      prismaMock.order.findUnique.mockResolvedValue(order);

      await expect(service.cancel('user-1', 'order-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should scope the lookup to the requesting user (ownership check)', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(service.cancel('wrong-user', 'order-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1', userId: 'wrong-user' },
      });
    });
  });
});
