import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class UnavailableProductVariantException extends HttpAppException {
  constructor(message = 'This product variant is currently unavailable') {
    super('UNAVAILABLE_PRODUCT_VARIANT', message, HttpStatus.BAD_REQUEST);
  }
}
