import { CreateCartItemSchema, createCartItemSchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class CreateCartItemDto
  extends createDto(createCartItemSchema)
  implements CreateCartItemSchema
{
  productVariantId: string;
  quantity: number;
  extras: { extraId: string; quantity: number }[];
}
