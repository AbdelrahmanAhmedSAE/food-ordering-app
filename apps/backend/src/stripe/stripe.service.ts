import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe as StripeNamespace } from 'stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: StripeNamespace;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!key) throw new Error('STRIPE_SECRET_KEY is not defined');
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  public async createPaymentIntent(amount: number, orderId: string) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { orderId },
    });
  }

  public constructWebhookEvent(rawBody: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }

  public async refundPayment(paymentIntentId: string) {
    return this.stripe.refunds.create({ payment_intent: paymentIntentId });
  }
}
