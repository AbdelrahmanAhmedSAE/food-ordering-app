import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentStatus } from 'src/generated/prisma/enums';
import { PaymentFailedEvent } from 'src/payment/events/payment-failed.event';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentFailedListener {
  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent(PaymentFailedEvent.name)
  public async handle(payload: PaymentFailedEvent) {
    await this.prismaService.order.update({
      where: { id: payload.orderId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        paymentStatus: PaymentStatus.FAILED,
      },
    });
  }
}
