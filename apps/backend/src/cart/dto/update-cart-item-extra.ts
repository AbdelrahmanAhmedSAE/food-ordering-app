import { IsOptional, IsPositive } from 'class-validator';

export class UpdateCartItemExtraDto {
  @IsOptional()
  @IsPositive()
  quantity: number;
}
