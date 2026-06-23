import { createCartItemExtraSchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class CreateCartItemExtraDto extends createDto(
  createCartItemExtraSchema,
) {}
