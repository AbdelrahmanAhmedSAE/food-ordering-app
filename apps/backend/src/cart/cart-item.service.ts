import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemWithExtras, CartWithItems } from './cart.types';
import ApiResponse from 'src/lib/response';
import { CartItem } from 'src/generated/prisma/client';
import Nullable from 'src/lib/types/nullable';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemService {
  constructor(private readonly prismaService: PrismaService) {}

  public async addItemToCart(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<ApiResponse<CartWithItems>> {
    const productVariant = await this.prismaService.productVariant.findUnique({
      where: { id: createCartItemDto.productVariantId },
    });

    if (!productVariant || !productVariant.isAvailable)
      throw new BadRequestException(
        'This product variant currently unavailable',
      );

    const cart: CartWithItems = await this.prismaService.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { cartItems: { include: { cartItemExtras: true } } },
    });

    const cartItem: CartItemWithExtras =
      await this.prismaService.cartItem.upsert({
        where: {
          cartId_productVariantId: {
            cartId: cart.id,
            productVariantId: createCartItemDto.productVariantId,
          },
        },
        create: {
          cartId: cart.id,
          productVariantId: createCartItemDto.productVariantId,
          quantity: createCartItemDto.quantity,
        },
        update: {
          quantity: {
            increment: createCartItemDto.quantity,
          },
        },
        include: { cartItemExtras: true },
      });

    cart.cartItems.push(cartItem);

    return new ApiResponse<CartWithItems>(cart).addMeta(
      'message',
      'Item has added in the cart',
    );
  }

  public async updateCartItem(
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<ApiResponse<CartItem>> {
    const item: Nullable<CartItem> =
      await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
      });

    if (!item) throw new NotFoundException('Cart item not found');

    if (updateCartItemDto.productVariantId) {
      const productVariant = await this.prismaService.productVariant.findUnique(
        {
          where: { id: updateCartItemDto.productVariantId },
        },
      );

      if (!productVariant || !productVariant.isAvailable)
        throw new BadRequestException(
          'This product variant currently unavailable',
        );
    }

    const updatedItem: CartItem = await this.prismaService.cartItem.update({
      where: { id: cartItemId },
      data: {
        productVariantId: updateCartItemDto.productVariantId,
        quantity: updateCartItemDto.quantity,
      },
      include: { cartItemExtras: true },
    });

    return new ApiResponse<CartItem>(updatedItem).addMeta(
      'message',
      'Item updated successfully',
    );
  }

  public async deleteCartItem(cartItemId: string): Promise<ApiResponse<void>> {
    const item: Nullable<CartItem> =
      await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
      });

    if (!item) throw new NotFoundException('Cart item not found');

    await this.prismaService.cartItem.delete({ where: { id: cartItemId } });

    return new ApiResponse<void>(undefined).addMeta(
      'message',
      'Item deleted successfully',
    );
  }
}
