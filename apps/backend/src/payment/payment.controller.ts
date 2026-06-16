import {
  Controller,
  Post,
  Param,
  HttpCode,
  Req,
  RawBodyRequest,
  Headers,
  Body,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @SetResponseMessage('Creating intent successfully')
  @Post('create-intent')
  public async createPaymentIntent(
    @Body('orderId') orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentService.createIntent(orderId, user.id);
  }

  @Post('webhook')
  @HttpCode(200)
  public handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(req.rawBody as Buffer, signature);
  }

  @Post('refund/:paymentIntentId')
  public async refund(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentService.refund(paymentIntentId);
  }
}
