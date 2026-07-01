import { ApiResponse } from '@repo/shared';
import { ErrorCode } from '@repo/shared';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status: number = exception.getStatus();
      const res = exception.getResponse();
      const hasCustomError =
        typeof res === 'object' &&
        res !== null &&
        'error' in res &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof (res as any).error === 'object';

      return response.status(status).json({
        success: false,
        statusCode: status,
        data: null,
        error: hasCustomError
          ? (res as { error: { code: ErrorCode; message: string } }).error
          : {
              code: this.getErrorCode(status),
              message: exception.message,
            },
      } satisfies ApiResponse<null>);
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      console.error('Prisma error code:', exception.code, exception.message);
      switch (exception.code) {
        case 'P2002':
          return response.status(409).json({
            success: false,
            statusCode: 409,
            data: null,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Already exists',
            },
          } satisfies ApiResponse<null>);
        case 'P2025':
          return response.status(404).json({
            success: false,
            statusCode: 404,
            data: null,
            error: {
              code: 'RECORD_NOT_FOUND',
              message: 'Record not found',
            },
          } satisfies ApiResponse<null>);
        default:
          return response.status(500).json({
            success: false,
            statusCode: 500,
            data: null,
            error: {
              code: 'DATABASE_ERROR',
              message: 'Database error',
            },
          } satisfies ApiResponse<null>);
      }
    }

    console.error(exception);
    return response.status(500).json({
      success: false,
      statusCode: 500,
      data: null,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    } satisfies ApiResponse<null>);
  }

  private getErrorCode(status: number): ErrorCode {
    switch (status) {
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.RECORD_NOT_FOUND;
      case 409:
        return ErrorCode.DUPLICATE_ENTRY;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
