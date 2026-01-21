import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieAwareRequest } from '../types/auth-cookie.types';
import type { Response } from 'express';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<CookieAwareRequest>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const cookies = request.pendingCookies;
        if (!cookies || cookies.length === 0) return;

        for (const cookie of cookies) {
          response.cookie(cookie.name, cookie.value, cookie.options ?? {});
        }
      }),
    );
  }
}
