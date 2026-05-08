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
import { CartItemExtraService } from './cart-item-extra.service';
import { CookieAwareRequest } from 'src/auth/types/auth-cookie.types';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateCartItemExtraDto } from './dto/create-cart-item-extra.dto';
import { UpdateCartItemExtraDto } from './dto/update-cart-item-extra';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly cartItemExtraService: CartItemExtraService,
  ) {}

  @Post()
  public async createCart(@Req() req: CookieAwareRequest) {
    return this.cartService.createCart(req.user?.id ?? '');
  }

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
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.updateCartItem(itemId, updateCartItemDto);
  }

  @Delete('item/:itemId')
  public async deleteCartItem(@Param('itemId') itemId: string) {
    return this.cartItemService.deleteCartItem(itemId);
  }

  @Post('item/:itemId/extra')
  public async addExtraToCartItem(
    @Param('itemId') itemId: string,
    @Body() createCartItemExtraDto: CreateCartItemExtraDto,
  ) {
    return this.cartItemExtraService.addExtraToCartItem(
      itemId,
      createCartItemExtraDto,
    );
  }

  @Patch('item/:itemId/extra/:extraId')
  public async updateCartItemExtraQuantity(
    @Param('extraId') extraId: string,
    @Body() updateCartItemExtraQuantity: UpdateCartItemExtraDto,
  ) {
    return this.cartItemExtraService.updateCartItemExtraQuantity(
      extraId,
      updateCartItemExtraQuantity,
    );
  }

  @Delete('item/:itemId/extra/:extraId')
  public async deleteExtraFromCartItem(
    @Param('itemId') itemId: string,
    @Param('extraId') extraId: string,
  ) {
    return this.cartItemExtraService.deleteExtraFromCartItem(itemId, extraId);
  }
}
