import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { AppValidationException } from '../exceptions/app-validation.exception';

@Injectable()
export class AppValidationPipe implements PipeTransform {
  transform(value: unknown, { metatype }: ArgumentMetadata) {
    const schema = (metatype as { schema?: ZodType })?.schema;
    if (!schema) return value;

    try {
      return schema.parse(value);
    } catch (error: any) {
      if (error instanceof ZodError) throw new AppValidationException(error);
      throw error;
    }
  }
}
