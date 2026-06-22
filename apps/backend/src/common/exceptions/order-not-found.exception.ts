import { ErrorCode } from '@repo/shared';
import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class OrderNotFoundException extends HttpAppException {
  constructor(message = 'Order not found') {
    super(ErrorCode.ORDER_NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}
