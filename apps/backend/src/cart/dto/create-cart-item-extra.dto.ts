import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { CreateCartItemExtraDto as ICreateCartItemExtraDto } from '@repo/shared';

export class CreateCartItemExtraDto implements ICreateCartItemExtraDto {
  @IsNotEmpty()
  @IsString()
  extraId: string;

  @IsPositive()
  quantity: number;
}
