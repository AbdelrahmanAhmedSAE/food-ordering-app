import { Reflector } from '@nestjs/core';
import { CookieConfig } from '../types/cookie';

export const SetCookie = Reflector.createDecorator<CookieConfig[]>();
