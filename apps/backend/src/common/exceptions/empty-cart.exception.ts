import { HttpAppException } from './http-app.exception';
import { HttpStatus } from '@nestjs/common';

export class EmptyCartException extends HttpAppException {
  constructor(message = 'Your cart is empty') {
    super('CART_EMPTY', message, HttpStatus.BAD_REQUEST);
  }
}
