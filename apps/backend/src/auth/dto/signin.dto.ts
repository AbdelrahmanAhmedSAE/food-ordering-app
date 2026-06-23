import { signinSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export class SigninDto extends createZodDto(signinSchema) {}
