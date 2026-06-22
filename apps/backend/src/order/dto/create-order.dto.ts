import {
  type CreateOrderSchema,
  createOrderSchema,
  PaymentMethod,
} from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

// type CreateOrderSchema = z

export class CreateOrderDto
  extends createZodDto(createOrderSchema)
  implements CreateOrderSchema
{
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}
