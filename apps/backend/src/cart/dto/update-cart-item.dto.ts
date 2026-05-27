import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateCartItemExtraDto } from './create-cart-item-extra.dto';

export class UpdateCartItemDto {
  @IsOptional()
  @IsPositive()
  quantity: number;

  @Optional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemExtraDto)
  extras: CreateCartItemExtraDto[];
}
