import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';
import { ErrorCode } from '@repo/shared';

export class OrderCannotBeCanceledException extends HttpAppException {
  constructor(message = "You can't cancel this order") {
    super(ErrorCode.ORDER_CANNOT_BE_CANCELED, message, HttpStatus.BAD_REQUEST);
  }
}
