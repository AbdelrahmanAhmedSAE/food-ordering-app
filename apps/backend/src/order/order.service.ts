import { Injectable } from '@nestjs/common';
import type { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, PaymentMethod } from 'src/generated/prisma/enums';
import type { Order } from 'src/generated/prisma/client';
import type {
  Nullable,
  OrderDetail,
  OrderItemDetail,
  OrderItemExtra,
  OrderSummary,
} from '@repo/shared/';
import { PaymentService } from 'src/payment/payment.service';
import {
  orderDetailQuery,
  type RawOrderDetail,
  type RawOrderItemDetail,
  type RawOrderItemExtra,
} from './order.queries';
import {
  EmptyCartException,
  OrderCannotBeCanceledException,
  OrderNotFoundException,
} from 'src/common/exceptions';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  public async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderSummary> {
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

    if (!cart || cart.cartItems.length === 0) throw new EmptyCartException();

    return this.prismaService.$transaction(async (tx) => {
      const order: Order = await tx.order.create({
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

      return this.mapOrderSummary(order);
    });
  }

  public async findAll(userId: string): Promise<OrderDetail[]> {
    const orders: RawOrderDetail[] = await this.prismaService.order.findMany({
      where: { userId },
      ...orderDetailQuery,
    });

    return this.mapOrdersDetail(orders);
  }

  public async cancel(userId: string, orderId: string): Promise<OrderSummary> {
    const order: Nullable<Order> = await this.prismaService.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) throw new OrderNotFoundException();

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CONFIRMED
    )
      throw new OrderCannotBeCanceledException();

    const updatedOrder: Order = await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELED,
      },
    });

    if (order.paymentMethod === PaymentMethod.ONLINE && order.paymentIntentId) {
      await this.paymentService.refund(order.paymentIntentId);
    }

    return this.mapOrderSummary(updatedOrder);
  }

  private mapOrderSummary(order: Order): OrderSummary {
    return {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice.toNumber(),
      paymentIntentId: order.paymentIntentId,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      deliveryAddress: order.deliveryAddress,
    };
  }

  private mapOrdersDetail(orders: RawOrderDetail[]): OrderDetail[] {
    return orders.map((order) => this.mapOrderDetail(order));
  }

  private mapOrderDetail(order: RawOrderDetail): OrderDetail {
    return {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice.toNumber(),
      paymentIntentId: order.paymentIntentId,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map((item) => this.mapOrderItemDetail(item)),
    };
  }

  private mapOrderItemDetail(item: RawOrderItemDetail): OrderItemDetail {
    return {
      id: item.id,
      name: item.name,
      totalPrice: item.totalPrice.toNumber(),
      quantity: item.quantity,
      orderId: item.orderId,
      extras: item.orderItemExtras.map((extra) =>
        this.mapOrderItemExtra(extra),
      ),
      createdAt: item.createdAt.toISOString(),
    };
  }

  private mapOrderItemExtra(extra: RawOrderItemExtra): OrderItemExtra {
    return {
      id: extra.id,
      name: extra.name,
      totalPrice: extra.totalPrice.toNumber(),
      quantity: extra.quantity,
      orderItemId: extra.orderItemId,
      createdAt: extra.createdAt.toISOString(),
    };
  }
}
