import { Injectable, NotFoundException } from '@nestjs/common';
import ApiResponse from 'src/lib/response';
import type Nullable from 'src/lib/types/nullable';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CartWithItems, CartWithItemsFromDB } from './cart.types';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createCart(userId: string): Promise<ApiResponse<CartWithItems>> {
    const user: Nullable<User> = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const cart: CartWithItemsFromDB = await this.prismaService.cart.create({
      data: { userId },
      include: {
        cartItems: {
          include: {
            cartItemExtras: {
              include: {
                productExtra: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
            productVariant: {
              select: {
                id: true,
                name: true,
                price: true,
                product: {
                  select: {
                    name: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return new ApiResponse<CartWithItems>(this.mapCart(cart)).addMeta(
      'message',
      'Cart created successfully',
    );
  }

  public async findCartById(
    cartId: string,
  ): Promise<ApiResponse<CartWithItems>> {
    const cart: Nullable<CartWithItemsFromDB> =
      await this.prismaService.cart.findUnique({
        where: { id: cartId },
        include: {
          cartItems: {
            include: {
              cartItemExtras: {
                include: {
                  productExtra: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                    },
                  },
                },
              },
              productVariant: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                      images: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { url: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!cart) throw new NotFoundException('Cart not found');

    return new ApiResponse<CartWithItems>(this.mapCart(cart)).addMeta(
      'message',
      'Cart fetched successfully',
    );
  }

  public async findCartByUserId(
    userId: string,
  ): Promise<ApiResponse<CartWithItems>> {
    const cart: Nullable<CartWithItemsFromDB> =
      await this.prismaService.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              cartItemExtras: {
                include: {
                  productExtra: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                    },
                  },
                },
              },
              productVariant: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                      images: {
                        where: { isPrimary: true },
                        take: 1,
                        select: { url: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!cart) throw new NotFoundException('Cart not found');

    return new ApiResponse<CartWithItems>(this.mapCart(cart)).addMeta(
      'message',
      'Cart fetched successfully',
    );
  }

  public mapCart(cart: CartWithItemsFromDB): CartWithItems {
    return {
      ...cart,
      totalPrice: cart.totalPrice.toNumber(),
      cartItems: cart.cartItems.map((cartItem) => ({
        ...cartItem,
        totalPrice: cartItem.totalPrice.toNumber(),
        productName: cartItem.productVariant.product.name,
        productImage: {
          url: cartItem.productVariant.product.images[0].url,
        },
        productVariant: {
          ...cartItem.productVariant,
          price: cartItem.productVariant.price.toNumber(),
        },
        cartItemExtras: cartItem.cartItemExtras.map((extra) => ({
          ...extra,
          productExtra: {
            ...extra.productExtra,
            price: extra.productExtra.price.toNumber(),
          },
        })),
      })),
    };
  }
}
