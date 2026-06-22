import { ApiResponse } from '@repo/shared';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetResponseMessage } from '../decorators/set-message.decorator';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    const message: string | undefined = this.reflector.getAllAndOverride<
      string | undefined
    >(SetResponseMessage, [context.getHandler(), context.getClass()]);

    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(
        (data: unknown) =>
          ({
            success: true,
            statusCode: res.statusCode,
            data,
            message: message ?? 'Success',
          }) satisfies ApiResponse<unknown>,
      ),
    );
  }
}
