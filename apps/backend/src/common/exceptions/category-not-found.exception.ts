import { HttpAppException } from './http-app.exception';
import { HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpAppException {
  constructor(message = 'Category not found') {
    super('CATEGORY_NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }
}
