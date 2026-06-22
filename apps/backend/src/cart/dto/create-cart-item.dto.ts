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
import { CreateCartItemDto as ICreateCartItemDto } from '@repo/shared';

export class CreateCartItemDto implements ICreateCartItemDto {
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
