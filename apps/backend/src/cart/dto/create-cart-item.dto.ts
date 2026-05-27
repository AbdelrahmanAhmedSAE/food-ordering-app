import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCartItemExtraDto } from './create-cart-item-extra.dto';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsString()
  productVariantId: string;

  @IsPositive()
  quantity: number;

  @Optional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemExtraDto)
  extras: CreateCartItemExtraDto[];
}
