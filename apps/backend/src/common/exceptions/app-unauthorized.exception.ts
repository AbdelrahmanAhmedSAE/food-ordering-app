import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class AppUnauthorizedException extends HttpAppException {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
  }
}
