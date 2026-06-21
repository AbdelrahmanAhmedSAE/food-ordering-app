import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  type Cart,
  Prisma,
  type ProductExtra,
  type ProductVariant,
} from 'src/generated/prisma/client';
import { type CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from './cart.service';
import { type RawCartDetail, cartDetailQuery } from './cart.queries';
import type { CartDetail } from '@app/shared';
import {
  CartNotFoundException,
  InvalidProductExtraException,
  UnavailableProductVariantException,
} from 'src/common/exceptions';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cartService: CartService,
  ) {}

  public async addItemToCart(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartDetail> {
    const productVariant = await this.prismaService.productVariant.findUnique({
      where: { id: createCartItemDto.productVariantId },
    });

    if (!productVariant || !productVariant.isAvailable)
      throw new UnavailableProductVariantException();

    const extras = createCartItemDto.extras ?? [];

    const validExtras = await this.prismaService.productExtra.findMany({
      where: {
        id: { in: extras.map((e) => e.extraId) },
        productId: productVariant.productId,
      },
    });

    if (validExtras.length !== extras.length)
      throw new InvalidProductExtraException();

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

    const updatedCart: RawCartDetail = await this.prismaService.cart.update({
      ...cartDetailQuery,
      where: { userId },
      data: { totalPrice: { increment: itemTotalPrice } },
    });

    return this.cartService.mapCart(updatedCart);
  }

  public async deleteCartItem(
    userId: string,
    cartItemId: string,
  ): Promise<void> {
    try {
      await this.prismaService.cartItem.delete({
        where: { id: cartItemId, cart: { userId } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new CartNotFoundException();
      }
      throw error;
    }
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
