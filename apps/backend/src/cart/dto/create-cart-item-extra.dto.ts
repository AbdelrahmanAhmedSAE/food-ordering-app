import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCartItemExtraDto {
  @IsNotEmpty()
  @IsString()
  extraId: string;

  @IsPositive()
  quantity: number;
}
