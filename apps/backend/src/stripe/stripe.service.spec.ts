import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StripeService } from './stripe.service';

// ── Mocks ─────────────────────────────────────────────────────────────────────

/**
 * بنعمل mock لـ Stripe SDK بالكامل عشان مش هنستدعي API حقيقي
 * كل method بترجع mock function نقدر نتحقق منها بـ toHaveBeenCalledWith
 */
const stripeInstanceMock = {
  paymentIntents: {
    create: vi.fn(),
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
  refunds: {
    create: vi.fn(),
  },
};

vi.mock('stripe', () => ({
  default: vi.fn(function StripeMock() {
    return stripeInstanceMock;
  }),
}));

const configServiceMock = {
  get: vi.fn(),
  getOrThrow: vi.fn(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    vi.clearAllMocks();
    configServiceMock.get.mockReturnValue('sk_test_fake_key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  // ── constructor ─────────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('should throw an error when STRIPE_SECRET_KEY is not defined', async () => {
      configServiceMock.get.mockReturnValue(undefined);

      await expect(
        Test.createTestingModule({
          providers: [
            StripeService,
            { provide: ConfigService, useValue: configServiceMock },
          ],
        }).compile(),
      ).rejects.toThrow('STRIPE_SECRET_KEY is not defined');
    });

    it('should initialize successfully when STRIPE_SECRET_KEY is defined', () => {
      expect(service).toBeDefined();
    });
  });

  // ── createPaymentIntent ─────────────────────────────────────────────────────

  describe('createPaymentIntent', () => {
    it('should convert amount to cents before sending to Stripe', async () => {
      stripeInstanceMock.paymentIntents.create.mockResolvedValue({
        id: 'pi_123',
      });

      await service.createPaymentIntent(50, 'order-1');

      expect(stripeInstanceMock.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000, // 50 × 100
        currency: 'usd',
        metadata: { orderId: 'order-1' },
      });
    });

    it('should handle decimal amounts correctly', async () => {
      stripeInstanceMock.paymentIntents.create.mockResolvedValue({
        id: 'pi_124',
      });

      await service.createPaymentIntent(19.99, 'order-2');

      expect(stripeInstanceMock.paymentIntents.create).toHaveBeenCalledWith({
        amount: 1999, // 19.99 × 100
        currency: 'usd',
        metadata: { orderId: 'order-2' },
      });
    });

    it('should pass orderId in metadata', async () => {
      stripeInstanceMock.paymentIntents.create.mockResolvedValue({
        id: 'pi_125',
      });

      await service.createPaymentIntent(100, 'order-xyz');

      expect(stripeInstanceMock.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({ metadata: { orderId: 'order-xyz' } }),
      );
    });

    it('should return the result from Stripe', async () => {
      const expectedResult = {
        id: 'pi_126',
        status: 'requires_payment_method',
      };
      stripeInstanceMock.paymentIntents.create.mockResolvedValue(
        expectedResult,
      );

      const result = await service.createPaymentIntent(30, 'order-3');

      expect(result).toEqual(expectedResult);
    });
  });

  // ── constructWebhookEvent ───────────────────────────────────────────────────

  describe('constructWebhookEvent', () => {
    it('should call Stripe webhooks.constructEvent with the correct arguments', () => {
      configServiceMock.getOrThrow.mockReturnValue('whsec_test_secret');
      const rawBody = Buffer.from('payload');
      const signature = 'test-signature';
      const expectedEvent = { type: 'payment_intent.succeeded' };
      stripeInstanceMock.webhooks.constructEvent.mockReturnValue(expectedEvent);

      const result = service.constructWebhookEvent(rawBody, signature);

      expect(stripeInstanceMock.webhooks.constructEvent).toHaveBeenCalledWith(
        rawBody,
        signature,
        'whsec_test_secret',
      );
      expect(result).toEqual(expectedEvent);
    });

    it('should throw when STRIPE_WEBHOOK_SECRET is missing (via getOrThrow)', () => {
      configServiceMock.getOrThrow.mockImplementation(() => {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
      });

      expect(() =>
        service.constructWebhookEvent(Buffer.from('payload'), 'sig'),
      ).toThrow('STRIPE_WEBHOOK_SECRET is not defined');
    });

    it('should propagate signature verification errors from Stripe', () => {
      configServiceMock.getOrThrow.mockReturnValue('whsec_test_secret');
      stripeInstanceMock.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Webhook signature verification failed');
      });

      expect(() =>
        service.constructWebhookEvent(Buffer.from('payload'), 'invalid-sig'),
      ).toThrow('Webhook signature verification failed');
    });
  });

  // ── refundPayment ───────────────────────────────────────────────────────────

  describe('refundPayment', () => {
    it('should call Stripe refunds.create with the payment intent id', async () => {
      const expectedRefund = { id: 're_123', status: 'succeeded' };
      stripeInstanceMock.refunds.create.mockResolvedValue(expectedRefund);

      const result = await service.refundPayment('pi_123');

      expect(stripeInstanceMock.refunds.create).toHaveBeenCalledWith({
        payment_intent: 'pi_123',
      });
      expect(result).toEqual(expectedRefund);
    });
  });
});
