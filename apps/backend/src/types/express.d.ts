import { AuthIdentity } from '@/auth/types/auth-identity.type';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends AuthIdentity {}
  }
}
