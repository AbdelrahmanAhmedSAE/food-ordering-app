import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';
import { ErrorCode } from '@repo/shared';

export class AppUnauthorizedException extends HttpAppException {
  constructor(message = 'Unauthorized') {
    super(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
  }
}
