import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CartItemExtra } from 'src/generated/prisma/client';
import ApiResponse from 'src/lib/response';
import type Nullable from 'src/lib/types/nullable';
import type {
  CartItemWithExtras,
  CartItemWithExtrasAndProductVariant,
} from './cart.types';
import { CreateCartItemExtraDto } from './dto/create-cart-item-extra.dto';
import { UpdateCartItemExtraDto } from './dto/update-cart-item-extra';

@Injectable()
export class CartItemExtraService {
  constructor(private readonly prismaService: PrismaService) {}

  public async addExtraToCartItem(
    cartItemId: string,
    createCartItemExtra: CreateCartItemExtraDto,
  ): Promise<ApiResponse<CartItemWithExtras>> {
    const item: Nullable<CartItemWithExtrasAndProductVariant> =
      await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          cartItemExtras: true,
          productVariant: {
            include: { product: { include: { extras: true } } },
          },
        },
      });

    if (!item) throw new NotFoundException('Cart item not found');

    const productExtra = item.productVariant.product.extras.find(
      (extra) => extra.id === createCartItemExtra.extraId,
    );

    if (!productExtra || !productExtra.isAvailable)
      throw new BadRequestException('This product extra currently unavailable');

    await this.prismaService.cartItemExtra.upsert({
      where: {
        cartItemId_productExtraId: {
          cartItemId: item.id,
          productExtraId: createCartItemExtra.extraId,
        },
      },
      create: {
        cartItemId: cartItemId,
        productExtraId: createCartItemExtra.extraId,
        quantity: createCartItemExtra.quantity,
      },
      update: { quantity: { increment: createCartItemExtra.quantity } },
    });

    const updatedItem = await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cartItemExtras: true },
    });

    if (!updatedItem) throw new NotFoundException('Cart item not found');

    return new ApiResponse<CartItemWithExtras>(updatedItem).addMeta(
      'message',
      'Extra added to cart item successfully',
    );
  }

  public async updateCartItemExtraQuantity(
    cartItemExtraId: string,
    updateCartItemExtraQuantity: UpdateCartItemExtraDto,
  ): Promise<ApiResponse<CartItemExtra>> {
    const extra: Nullable<CartItemExtra> =
      await this.prismaService.cartItemExtra.findUnique({
        where: { id: cartItemExtraId },
      });

    if (!extra) throw new NotFoundException('Cart item extra not found');

    const newExtra: CartItemExtra =
      await this.prismaService.cartItemExtra.update({
        where: { id: cartItemExtraId },
        data: {
          quantity: updateCartItemExtraQuantity.quantity,
        },
      });

    return new ApiResponse<CartItemExtra>(newExtra).addMeta(
      'message',
      'Extra quantity updated to cart item successfully',
    );
  }

  public async deleteExtraFromCartItem(
    cartItemId: string,
    itemExtraId: string,
  ): Promise<ApiResponse<CartItemWithExtras>> {
    const item: Nullable<CartItemWithExtras> =
      await this.prismaService.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cartItemExtras: true },
      });

    if (!item) throw new NotFoundException('Cart item not found');

    const itemExtra: Nullable<CartItemExtra> =
      await this.prismaService.cartItemExtra.findUnique({
        where: { id: itemExtraId },
      });

    if (!itemExtra) throw new NotFoundException('Extra not found');
    await this.prismaService.cartItemExtra.delete({
      where: { id: itemExtraId },
    });

    const updatedItem = await this.prismaService.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cartItemExtras: true },
    });
    if (!updatedItem) throw new NotFoundException('Cart item not found');

    return new ApiResponse<CartItemWithExtras>(item).addMeta(
      'message',
      'Extra deleted from cart item successfully',
    );
  }
}
