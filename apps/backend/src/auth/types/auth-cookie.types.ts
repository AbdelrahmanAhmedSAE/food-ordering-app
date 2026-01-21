import { CookieOptions, Request } from 'express';

export interface PendingCookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

export interface CookieAwareRequest extends Request {
  pendingCookies?: PendingCookie[];
}
