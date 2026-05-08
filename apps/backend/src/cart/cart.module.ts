import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemService } from './cart-item.service';
import { CartItemExtraService } from './cart-item-extra.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartItemService, CartItemExtraService],
})
export class CartModule {}
