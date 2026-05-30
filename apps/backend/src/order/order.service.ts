import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from 'src/generated/prisma/enums';
import ApiResponse from 'src/lib/response';
import { Order } from 'src/generated/prisma/client';
import Nullable from 'src/lib/types/nullable';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            cartItemExtras: {
              include: { productExtra: true },
            },
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0)
      throw new BadRequestException('Your cart is empty');

    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          paymentMethod: createOrderDto.paymentMethod,
          deliveryAddress: createOrderDto.deliveryAddress,
          totalPrice: cart.totalPrice,
          items: {
            create: cart.cartItems.map((cartItem) => ({
              name: `${cartItem.productVariant.product.name}-${cartItem.productVariant.name}`,
              quantity: cartItem.quantity,
              totalPrice: cartItem.totalPrice,
              productVariantId: cartItem.productVariantId,
              orderItemExtras: {
                create: cartItem.cartItemExtras.map((extra) => ({
                  name: extra.productExtra.name,
                  quantity: extra.quantity,
                  totalPrice: extra.totalPrice,
                  productExtraId: extra.productExtraId,
                })),
              },
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { totalPrice: 0 },
      });

      return new ApiResponse<Order>(order).addMeta(
        'message',
        'Order created successfully',
      );
    });
  }

  public async findAll(userId: string) {
    const orders: Order[] = await this.prismaService.order.findMany({
      where: { userId },
    });

    return new ApiResponse<Order[]>(orders).addMeta(
      'message',
      'Orders fetched successfully',
    );
  }

  public async cancel(userId: string, orderId: string) {
    const order: Nullable<Order> = await this.prismaService.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    )
      throw new BadRequestException("You can't cancel this order");

    const updatedOrder: Order = await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELED,
      },
    });

    return new ApiResponse<Order>(updatedOrder).addMeta(
      'message',
      'Order updated successfully',
    );
  }
}
