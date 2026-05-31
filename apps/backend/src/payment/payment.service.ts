import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentSucceededEvent } from './events/payment-succeeded.event';
import { PaymentFailedEvent } from './events/payment-failed.event';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createIntent(amount: number, orderId: string) {
    return this.stripeService.createPaymentIntent(amount, orderId);
  }

  public handleWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripeService.constructWebhookEvent(rawBody, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        this.eventEmitter.emit(
          PaymentSucceededEvent.name,
          new PaymentSucceededEvent(
            event.data.object.metadata.orderId,
            event.data.object.id,
          ),
        );

        break;

      case 'payment_intent.payment_failed':
        this.eventEmitter.emit(
          PaymentFailedEvent.name,
          new PaymentFailedEvent(event.data.object.metadata.orderId),
        );

        break;
    }

    return { received: true };
  }

  public async refund(paymentIntentId: string) {
    return this.stripeService.refundPayment(paymentIntentId);
  }
}
