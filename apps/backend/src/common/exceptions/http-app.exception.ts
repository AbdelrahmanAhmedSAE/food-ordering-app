import { ErrorCode } from '@app/shared/src/unions';
import { HttpException } from '@nestjs/common';

export class HttpAppException extends HttpException {
  constructor(code: ErrorCode, message: string, status: number) {
    super({ error: code, message }, status);
  }
}
