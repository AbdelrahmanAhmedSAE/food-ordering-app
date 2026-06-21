import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class UserNotFoundException extends HttpAppException {
  constructor(message = 'User not found') {
    super('USER_NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }
}
