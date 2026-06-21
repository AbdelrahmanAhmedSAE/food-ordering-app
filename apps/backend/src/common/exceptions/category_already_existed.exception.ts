import { HttpStatus } from '@nestjs/common';
import { HttpAppException } from './http-app.exception';

export class CategoryAlreadyExistedException extends HttpAppException {
  constructor(message = 'Category already exits') {
    super('CATEGORY_ALREADY_EXISTED', message, HttpStatus.BAD_REQUEST);
  }
}
