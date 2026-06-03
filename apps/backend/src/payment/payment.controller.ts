import {
  Controller,
  Post,
  Param,
  HttpCode,
  Req,
  RawBodyRequest,
  Headers,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CookieAwareRequest } from 'src/auth/types/auth-cookie.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  public async createPaymentIntent(
    @Body('orderId') orderId: string,
    @Req() req: CookieAwareRequest,
  ) {
    const user = req.user;
    console.log({ orderId, user });
    const response = await this.paymentService.createIntent(
      orderId,
      req.user?.id ?? '',
    );
    console.log(response);
    return response;
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
