import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Mohamed', minLength: 6, maxLength: 20 })
  @Length(6, 20)
  name: string;

  @ApiProperty({ example: 'ahmed@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Aa@12345',
    description: 'Strong password with uppercase, lowercase, number and symbol',
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.User })
  @IsOptional()
  @IsEnum(Role)
  role = Role.User;

  @ApiPropertyOptional({ example: '01012345678' })
  @IsOptional()
  @Length(11, 20)
  phone: string;

  @ApiPropertyOptional({ example: 'Cairo, Nasr City' })
  @IsOptional()
  @Length(11, 100)
  address: string;
}
