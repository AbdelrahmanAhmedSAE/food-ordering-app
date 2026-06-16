import { ApiResponse } from '@app/shared';
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
      const exceptionResponse: string | object = exception.getResponse();

      return response.status(status).json({
        success: false,
        statusCode: status,
        data: null,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as { message: string }).message,
      } satisfies ApiResponse<null>);
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return response.status(409).json({
            success: false,
            statusCode: 409,
            data: null,
            message: 'Already exists',
          } satisfies ApiResponse<null>);
        case 'P2025':
          return response.status(404).json({
            success: false,
            statusCode: 404,
            data: null,
            message: 'Record not found',
          } satisfies ApiResponse<null>);
        default:
          return response.status(500).json({
            success: false,
            statusCode: 500,
            data: null,
            message: 'Database error',
          } satisfies ApiResponse<null>);
      }
    }

    console.error(exception);
    return response.status(500).json({
      success: false,
      statusCode: 500,
      data: null,
      message: 'Internal server error',
    } satisfies ApiResponse<null>);
  }
}
