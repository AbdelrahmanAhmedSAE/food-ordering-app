import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';
import { ErrorCode } from '@repo/shared';

export class UnavailableProductVariantException extends HttpAppException {
  constructor(message = 'This product variant is currently unavailable') {
    super(
      ErrorCode.UNAVAILABLE_PRODUCT_VARIANT,
      message,
      HttpStatus.BAD_REQUEST,
    );
  }
}
