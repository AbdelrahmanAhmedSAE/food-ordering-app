import { ErrorCode } from '@repo/shared';
import { HttpAppException } from './http-app.exception';
import { HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class AppValidationException extends HttpAppException {
  constructor(validationErrors: ZodError, message = 'Validation failed') {
    super(
      ErrorCode.VALIDATION_ERROR,
      message,
      HttpStatus.BAD_REQUEST,
      validationErrors.flatten((issue) => issue.message).fieldErrors,
    );
  }
}
