import { Injectable, NotFoundException } from '@nestjs/common';
import ApiResponse from 'src/lib/response';
import type Nullable from 'src/lib/types/nullable';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CartWithItems } from './cart.types';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createCart(userId: string): Promise<ApiResponse<CartWithItems>> {
    const user: Nullable<User> = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const cart: CartWithItems = await this.prismaService.cart.create({
      data: { userId },
      include: {
        cartItems: {
          include: { cartItemExtras: true },
        },
      },
    });

    return new ApiResponse<CartWithItems>(cart).addMeta(
      'message',
      'Cart created successfully',
    );
  }

  public async findCartById(
    cartId: string,
  ): Promise<ApiResponse<CartWithItems>> {
    const cart: Nullable<CartWithItems> =
      await this.prismaService.cart.findUnique({
        where: { id: cartId },
        include: {
          cartItems: {
            include: { cartItemExtras: true },
          },
        },
      });

    if (!cart) throw new NotFoundException('Cart not found');

    return new ApiResponse<CartWithItems>(cart).addMeta(
      'message',
      'Cart fetched successfully',
    );
  }

  public async findCartByUserId(
    userId: string,
  ): Promise<ApiResponse<CartWithItems>> {
    const cart: Nullable<CartWithItems> =
      await this.prismaService.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: { cartItemExtras: true },
          },
        },
      });

    if (!cart) throw new NotFoundException('Cart not found');

    return new ApiResponse<CartWithItems>(cart).addMeta(
      'message',
      'Cart fetched successfully',
    );
  }
}
