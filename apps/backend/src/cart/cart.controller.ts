import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/generated/prisma/client';

@Controller('v1/cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  @SetResponseMessage('Cart fetched successfully')
  @Get()
  public async findCart(@CurrentUser() user: User) {
    return this.cartService.findCartByUserId(user.id);
  }

  @SetResponseMessage('Item has added in the cart')
  @Post('item')
  public async addItemToCart(
    @CurrentUser() user: User,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartItemService.addItemToCart(user.id, createCartItemDto);
  }

  @SetResponseMessage('Item deleted successfully')
  @Delete('item/:itemId')
  public async deleteCartItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
  ) {
    return this.cartItemService.deleteCartItem(user.id, itemId);
  }
}
