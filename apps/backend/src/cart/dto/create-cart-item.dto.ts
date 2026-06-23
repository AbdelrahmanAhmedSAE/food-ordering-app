import { createCartItemSchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class CreateCartItemDto extends createDto(createCartItemSchema) {}
