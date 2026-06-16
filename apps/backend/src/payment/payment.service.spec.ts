import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PaymentService } from './payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentSucceededEvent } from './events/payment-succeeded.event';
import { PaymentFailedEvent } from './events/payment-failed.event';

// ── Helpers ───────────────────────────────────────────────────────────────────

const decimal = (value: number) => ({ toNumber: () => value });

const makeOrder = (overrides: Record<string, unknown> = {}) => ({
  id: 'order-1',
  userId: 'user-1',
  totalPrice: decimal(99.99),
  ...overrides,
});

/**
 * بناء Stripe webhook event بشكل يحاكي الـ structure الحقيقي
 * event.data.object هو الـ PaymentIntent نفسه
 */
const makeStripeEvent = (
  type: string,
  objectOverrides: Record<string, unknown> = {},
) => ({
  type,
  data: {
    object: {
      id: 'pi_123',
      metadata: { orderId: 'order-1' },
      ...objectOverrides,
    },
  },
});

// ── Mocks ─────────────────────────────────────────────────────────────────────

const prismaMock = {
  order: { findUnique: vi.fn() },
};

const stripeServiceMock = {
  createPaymentIntent: vi.fn(),
  constructWebhookEvent: vi.fn(),
  refundPayment: vi.fn(),
};

const eventEmitterMock = {
  emit: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: StripeService, useValue: stripeServiceMock },
        { provide: EventEmitter2, useValue: eventEmitterMock },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    vi.clearAllMocks();
  });

  // ── createIntent ────────────────────────────────────────────────────────────

  describe('createIntent', () => {
    it('should create a payment intent using the order total price', async () => {
      const order = makeOrder({ totalPrice: decimal(49.5) });
      prismaMock.order.findUnique.mockResolvedValue(order);
      stripeServiceMock.createPaymentIntent.mockResolvedValue({ id: 'pi_123' });

      const result = await service.createIntent('order-1', 'user-1');

      expect(prismaMock.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1', userId: 'user-1' },
      });
      expect(stripeServiceMock.createPaymentIntent).toHaveBeenCalledWith(
        49.5,
        'order-1',
      );
      expect(result).toEqual({ id: 'pi_123' });
    });

    it('should throw NotFoundException when order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createIntent('nonexistent', 'user-1'),
      ).rejects.toThrow(new NotFoundException('Order not found'));

      expect(stripeServiceMock.createPaymentIntent).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when order belongs to a different user', async () => {
      // findUnique بيفلتر بالفعل بـ id + userId سوا، فلو الأوردر لمستخدم تاني هيرجع null
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(
        service.createIntent('order-1', 'wrong-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── handleWebhook ───────────────────────────────────────────────────────────

  describe('handleWebhook', () => {
    const rawBody = Buffer.from('payload');
    const signature = 'test-signature';

    it('should emit PaymentSucceededEvent on payment_intent.succeeded', () => {
      const event = makeStripeEvent('payment_intent.succeeded', {
        id: 'pi_success',
        metadata: { orderId: 'order-1' },
      });
      stripeServiceMock.constructWebhookEvent.mockReturnValue(event);

      const result = service.handleWebhook(rawBody, signature);

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        PaymentSucceededEvent.name,
        expect.objectContaining({
          orderId: 'order-1',
          paymentIntentId: 'pi_success',
        }),
      );
      expect(result).toEqual({ received: true });
    });

    it('should emit PaymentFailedEvent on payment_intent.payment_failed', () => {
      const event = makeStripeEvent('payment_intent.payment_failed', {
        metadata: { orderId: 'order-2' },
      });
      stripeServiceMock.constructWebhookEvent.mockReturnValue(event);

      const result = service.handleWebhook(rawBody, signature);

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        PaymentFailedEvent.name,
        expect.objectContaining({ orderId: 'order-2' }),
      );
      expect(result).toEqual({ received: true });
    });

    it('should not emit any event for unhandled event types', () => {
      const event = makeStripeEvent('charge.refunded');
      stripeServiceMock.constructWebhookEvent.mockReturnValue(event);

      const result = service.handleWebhook(rawBody, signature);

      expect(eventEmitterMock.emit).not.toHaveBeenCalled();
      expect(result).toEqual({ received: true });
    });

    it('should pass rawBody and signature to constructWebhookEvent', () => {
      stripeServiceMock.constructWebhookEvent.mockReturnValue(
        makeStripeEvent('charge.refunded'),
      );

      service.handleWebhook(rawBody, signature);

      expect(stripeServiceMock.constructWebhookEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
      );
    });

    it('should propagate errors from constructWebhookEvent (invalid signature)', () => {
      stripeServiceMock.constructWebhookEvent.mockImplementation(() => {
        throw new Error('Webhook signature verification failed');
      });

      expect(() => service.handleWebhook(rawBody, signature)).toThrow(
        'Webhook signature verification failed',
      );
      expect(eventEmitterMock.emit).not.toHaveBeenCalled();
    });
  });

  // ── refund ──────────────────────────────────────────────────────────────────

  describe('refund', () => {
    it('should delegate to stripeService.refundPayment', async () => {
      const expectedRefund = { id: 're_123', status: 'succeeded' };
      stripeServiceMock.refundPayment.mockResolvedValue(expectedRefund);

      const result = await service.refund('pi_123');

      expect(stripeServiceMock.refundPayment).toHaveBeenCalledWith('pi_123');
      expect(result).toEqual(expectedRefund);
    });
  });
});
