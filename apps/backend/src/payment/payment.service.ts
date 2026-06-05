import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentSucceededEvent } from './events/payment-succeeded.event';
import { PaymentFailedEvent } from './events/payment-failed.event';
import { PrismaService } from 'src/prisma/prisma.service';
import ApiResponse from 'src/lib/response';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async createIntent(orderId: string, userId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    const data = await this.stripeService.createPaymentIntent(
      order.totalPrice.toNumber(),
      orderId,
    );

    return new ApiResponse(data).addMeta(
      'message',
      'Creating intent successfully',
    );
  }

  public handleWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripeService.constructWebhookEvent(rawBody, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('metadata:', event.data.object.metadata); // ← هنا
        console.log('orderId:', event.data.object.metadata?.orderId);
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
