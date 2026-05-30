import { Injectable } from '@nestjs/common';
import { Stripe as StripeNamespace } from 'stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: StripeNamespace;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  public async createPaymentIntent(amount: number, orderId: string) {
    return this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { orderId },
    });
  }

  public constructWebhookEvent(rawBody: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  }

  public async refundPayment(paymentIntentId: string) {
    return this.stripe.refunds.create({ payment_intent: paymentIntentId });
  }
}
