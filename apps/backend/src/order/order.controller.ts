import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @SetResponseMessage('Order created successfully')
  @Post()
  public create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(user.id, createOrderDto);
  }

  @SetResponseMessage('Orders fetched successfully')
  @Get()
  public findAll(@CurrentUser() user: User) {
    return this.orderService.findAll(user.id);
  }

  @SetResponseMessage('Order canceled successfully')
  @Delete(':orderId')
  public cancel(@CurrentUser() user: User, @Param('orderId') orderId: string) {
    return this.orderService.cancel(user.id, orderId);
  }
}
