import { AuthIdentity } from '@/auth/types/auth-identity.type';

declare global {
  namespace Express {
    interface User extends AuthIdentity {
      id: string;
    }
  }
}
