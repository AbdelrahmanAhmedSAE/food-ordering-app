import { CookieOptions } from 'express';

export interface CookieConfig {
  name: string;
  options?: CookieOptions;
}
