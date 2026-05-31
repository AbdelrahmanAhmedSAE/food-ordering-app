import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  Req,
  RawBodyRequest,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  public async createPaymentIntent(
    @Body() body: { orderId: string; amount: number },
  ) {
    return this.paymentService.createIntent(body.amount, body.orderId);
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
