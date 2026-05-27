import { createHash } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CartItemWithExtrasAndProductVariant,
  CartItemWithExtrasAndProductVariantFromDB,
  CartWithItems,
  CartWithItemsFromDB,
} from './cart.types';
import ApiResponse from 'src/lib/response';
import {
  Cart,
  CartItem,
  Prisma,
  ProductExtra,
  ProductVariant,
} from 'src/generated/prisma/client';
import Nullable from 'src/lib/types/nullable';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartService: CartService,
  ) {}

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

    const extras = createCartItemDto.extras ?? [];

    const validExtras = await this.prismaService.productExtra.findMany({
      where: {
        id: { in: extras.map((e) => e.extraId) },
        productId: productVariant.productId,
      },
    });

    if (validExtras.length !== extras.length)
      throw new BadRequestException('One or more extras are invalid');

    const hashedExtras = this.hashExtras(extras.map((e) => e.extraId));

    let itemTotalPrice: number = 0;
    await this.prismaService.$transaction(async (tx) => {
      const cart: Cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productVariantId_extrasHash: {
            cartId: cart.id,
            productVariantId: createCartItemDto.productVariantId,
            extrasHash: hashedExtras,
          },
        },
      });

      if (existingItem) {
        itemTotalPrice = this.calcTotalPrice(
          productVariant,
          existingItem.quantity + createCartItemDto.quantity,
          validExtras,
          extras.map((e) => e.quantity),
        );

        const priceDiff = itemTotalPrice - existingItem.totalPrice.toNumber();
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: { increment: createCartItemDto.quantity },
            totalPrice: itemTotalPrice,
          },
        });

        itemTotalPrice = priceDiff;
      } else {
        itemTotalPrice = this.calcTotalPrice(
          productVariant,
          createCartItemDto.quantity,
          validExtras,
          extras.map((e) => e.quantity),
        );

        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productVariantId: createCartItemDto.productVariantId,
            quantity: createCartItemDto.quantity,
            totalPrice: itemTotalPrice,
            extrasHash: hashedExtras,
            cartItemExtras: {
              create: extras.map((e) => ({
                productExtraId: e.extraId,
                quantity: e.quantity,
              })),
            },
          },
        });
      }
    });

    const updatedCart: Nullable<CartWithItemsFromDB> =
      await this.prismaService.cart.update({
        where: { userId },
        data: { totalPrice: { increment: itemTotalPrice } },
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

    if (!updatedCart) throw new BadRequestException();

    return new ApiResponse<CartWithItems>(
      this.cartService.mapCart(updatedCart),
    ).addMeta('message', 'Item has added in the cart');
  }

  public async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<ApiResponse<CartItemWithExtrasAndProductVariant>> {
    try {
      const updatedItem: CartItemWithExtrasAndProductVariantFromDB =
        await this.prismaService.cartItem.update({
          where: { id: cartItemId, cart: { userId } },
          data: {
            quantity: updateCartItemDto.quantity,
          },
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
        });

      return new ApiResponse<CartItemWithExtrasAndProductVariant>(
        this.mapCartItem(updatedItem),
      ).addMeta('message', 'Item updated successfully');
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart item not found');
      }
      throw error;
    }
  }

  public async deleteCartItem(
    userId: string,
    cartItemId: string,
  ): Promise<ApiResponse<void>> {
    try {
      await this.prismaService.cartItem.delete({
        where: { id: cartItemId, cart: { userId } },
      });

      return new ApiResponse<void>(undefined).addMeta(
        'message',
        'Item deleted successfully',
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Cart item not found');
      }
      throw error;
    }
  }

  private mapCartItem(
    cartItem: CartItemWithExtrasAndProductVariantFromDB,
  ): CartItemWithExtrasAndProductVariant {
    return {
      ...cartItem,
      totalPrice: cartItem.totalPrice.toNumber(),
      productName: cartItem.productVariant.product.name,
      productImage: { url: cartItem.productVariant.product.images[0].url },
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
    };
  }

  private hashExtras(extraIds: string[]): string {
    if (extraIds.length === 0) return '';

    const sorted = [...extraIds].sort().join(',');
    return createHash('md5').update(sorted).digest('hex');
  }

  private calcTotalPrice(
    productVariant: ProductVariant,
    variantQuantity: number,
    extras: ProductExtra[],
    extrasQuantities: number[],
  ): number {
    return (
      this.calcVariantTotalPrice(productVariant, variantQuantity) +
      this.calcExtraTotalPrice(extras, extrasQuantities)
    );
  }

  private calcVariantTotalPrice(
    productVariant: ProductVariant,
    quantity: number,
  ): number {
    return productVariant.price.toNumber() * quantity;
  }

  private calcExtraTotalPrice(
    extras: ProductExtra[],
    extrasQuantities: number[],
  ): number {
    return extras.reduce(
      (total, extra, i) => total + extra.price.toNumber() * extrasQuantities[i],
      0,
    );
  }
}
