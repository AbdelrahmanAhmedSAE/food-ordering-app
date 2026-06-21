import { HttpAppException } from './http-app.exception';
import { HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpAppException {
  constructor(message = 'Product not found') {
    super('PRODUCT_NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }
}
