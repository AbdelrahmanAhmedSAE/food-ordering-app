import { createCategorySchema } from '@repo/shared';
import { createDto } from 'src/common/utils/create-dto';

export class CreateCategoryDto extends createDto(createCategorySchema) {}
