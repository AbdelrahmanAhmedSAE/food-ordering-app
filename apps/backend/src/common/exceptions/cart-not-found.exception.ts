import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class CartNotFoundException extends HttpAppException {
  constructor(message = 'Cart not found') {
    super('CART_NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }
}
