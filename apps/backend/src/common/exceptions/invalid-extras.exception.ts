import { ErrorCode } from '@repo/shared';
import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class InvalidProductExtraException extends HttpAppException {
  constructor(message = 'One or more extras are invalid') {
    super(ErrorCode.INVALID_PRODUCT_EXTRA, message, HttpStatus.BAD_REQUEST);
  }
}
