import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { SetCookie } from '../decorators/set-cookie.decorator';
import { Response } from 'express';
import { CookieConfig } from '../types/cookie';
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const cookieConfigs: CookieConfig[] = this.reflector.getAllAndOverride(
      SetCookie,
      [context.getHandler(), context.getClass()],
    );

    if (!cookieConfigs) return next.handle();

    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((result: Record<string, string>) => {
        for (const config of cookieConfigs) {
          const value = result[config.name];
          if (value) res.cookie(config.name, value, config.options ?? {});
        }
      }),
    );
  }
}
