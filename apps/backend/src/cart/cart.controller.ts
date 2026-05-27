import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemService } from './cart-item.service';
import { CookieAwareRequest } from 'src/auth/types/auth-cookie.types';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  @Get()
  public async findCart(@Req() req: CookieAwareRequest) {
    return this.cartService.findCartByUserId(req.user?.id ?? '');
  }

  @Post('item')
  public async addItemToCart(
    @Req() req: CookieAwareRequest,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartItemService.addItemToCart(
      req.user?.id ?? '',
      createCartItemDto,
    );
  }

  @Patch('item/:itemId')
  public async updateCartItem(
    @Req() req: CookieAwareRequest,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.updateCartItem(
      req.user?.id ?? '',
      itemId,
      updateCartItemDto,
    );
  }

  @Delete('item/:itemId')
  public async deleteCartItem(
    @Req() req: CookieAwareRequest,
    @Param('itemId') itemId: string,
  ) {
    return this.cartItemService.deleteCartItem(req.user?.id ?? '', itemId);
  }
}
