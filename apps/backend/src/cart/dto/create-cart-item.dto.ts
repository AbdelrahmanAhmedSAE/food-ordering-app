import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsString()
  productVariantId: string;

  @IsPositive()
  quantity: number;
}
