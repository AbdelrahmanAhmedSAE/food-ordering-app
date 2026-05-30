import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CookieAwareRequest } from 'src/auth/types/auth-cookie.types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  public create(
    @Req() req: CookieAwareRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(req.user?.id ?? '', createOrderDto);
  }

  @Get()
  public findAll(@Req() req: CookieAwareRequest) {
    return this.orderService.findAll(req.user?.id ?? '');
  }

  @Delete(':orderId')
  public cancel(
    @Req() req: CookieAwareRequest,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.cancel(req.user?.id ?? '', orderId);
  }
}
