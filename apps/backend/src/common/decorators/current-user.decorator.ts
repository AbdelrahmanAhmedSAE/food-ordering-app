import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Express.User | undefined => {
    const req = context.switchToHttp().getRequest<Request>();
    return req.user;
  },
);
