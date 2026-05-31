import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentStatus } from 'src/generated/prisma/enums';
import { PaymentSucceededEvent } from 'src/payment/events/payment-succeeded.event';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentSucceededListener {
  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent(PaymentSucceededEvent.name)
  public async handle(payload: PaymentSucceededEvent) {
    await this.prismaService.order.update({
      where: { id: payload.orderId },
      data: {
        paymentIntentId: payload.paymentIntentId,
        paymentStatus: PaymentStatus.PAID,
      },
    });
  }
}
