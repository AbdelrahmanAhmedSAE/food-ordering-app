import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PaymentMethod } from 'src/generated/prisma/enums';

export class CreateOrderDto {
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'Cairo, Nasr City' })
  @IsString()
  deliveryAddress: string;
}
