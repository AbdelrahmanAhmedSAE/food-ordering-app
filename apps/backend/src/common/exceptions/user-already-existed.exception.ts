import { ErrorCode } from '@repo/shared';
import { HttpAppException } from './http-app.exception';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyExistedException extends HttpAppException {
  constructor(message = 'User already existed') {
    super(ErrorCode.USER_ALREADY_EXISTED, message, HttpStatus.CONFLICT);
  }
}
