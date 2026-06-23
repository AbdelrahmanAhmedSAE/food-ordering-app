import { ErrorCode } from '@repo/shared';
import { HttpException } from '@nestjs/common';

export class HttpAppException extends HttpException {
  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    details?: Record<string, any>,
  ) {
    super({ error: { code, message, details } }, status);
  }
}
