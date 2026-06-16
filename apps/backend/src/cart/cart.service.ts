import { Injectable, NotFoundException } from '@nestjs/common';
import type Nullable from 'src/lib/types/nullable';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import {
  RawCartDetail,
  RawCartItemDetail,
  RawCartItemExtraDetail,
  cartDetailQuery,
} from './cart.queries';
import { CartDetail, CartItemDetail, CartItemExtraDetail } from '@app/shared';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createCart(userId: string): Promise<CartDetail> {
    const user: Nullable<User> = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const cart: RawCartDetail = await this.prismaService.cart.create({
      ...cartDetailQuery,
      data: { userId },
    });

    return this.mapCart(cart);
  }

  public async findCartByUserId(userId: string): Promise<CartDetail> {
    const cart: Nullable<RawCartDetail> =
      await this.prismaService.cart.findUnique({
        ...cartDetailQuery,
        where: { userId },
      });

    if (!cart) throw new NotFoundException('Cart not found');

    return this.mapCart(cart);
  }

  public mapCart(cart: RawCartDetail): CartDetail {
    return {
      id: cart.id,
      userId: cart.userId,
      totalPrice: cart.totalPrice.toNumber(),
      cartItems: cart.cartItems.map((cartItem) => this.mapCartItem(cartItem)),
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  private mapCartItem(cartItem: RawCartItemDetail): CartItemDetail {
    return {
      id: cartItem.id,
      cartId: cartItem.cartId,
      quantity: cartItem.quantity,
      totalPrice: cartItem.totalPrice.toNumber(),
      productName: cartItem.productVariant.product.name,
      productVariant: {
        id: cartItem.productVariant.id,
        name: cartItem.productVariant.name,
        price: cartItem.productVariant.price.toNumber(),
        image: { url: cartItem.productVariant.product.images[0].url },
      },
      cartItemExtras: cartItem.cartItemExtras.map((extra) =>
        this.mapCartItemExtra(extra),
      ),
      createdAt: cartItem.createdAt.toISOString(),
      updatedAt: cartItem.updatedAt.toISOString(),
    };
  }

  private mapCartItemExtra(extra: RawCartItemExtraDetail): CartItemExtraDetail {
    return {
      id: extra.id,
      itemId: extra.cartItemId,
      quantity: extra.quantity,
      totalPrice: extra.totalPrice.toNumber(),
      productExtra: {
        id: extra.productExtra.id,
        name: extra.productExtra.name,
        price: extra.productExtra.price.toNumber(),
      },
      createdAt: extra.createdAt.toISOString(),
      updatedAt: extra.updatedAt.toISOString(),
    };
  }
}
