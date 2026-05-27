import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemService } from './cart-item.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartItemService],
})
export class CartModule {}
