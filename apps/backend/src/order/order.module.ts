import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentSucceededListener } from './listeners/payment-succeeded.listener';
import { PaymentFailedListener } from './listeners/payment-failed.listener';

@Module({
  imports: [PaymentModule],
  controllers: [OrderController],
  providers: [OrderService, PaymentSucceededListener, PaymentFailedListener],
})
export class OrderModule {}
