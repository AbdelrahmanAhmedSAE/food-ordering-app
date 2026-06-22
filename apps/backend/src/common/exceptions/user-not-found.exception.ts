import { ErrorCode } from '@repo/shared';
import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class UserNotFoundException extends HttpAppException {
  constructor(message = 'User not found') {
    super(ErrorCode.USER_NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}
