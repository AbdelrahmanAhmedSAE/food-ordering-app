import { AuthIdentity } from '@/auth/types/auth-identity.type';
import { Role } from 'src/generated/prisma/enums';

declare global {
  namespace Express {
    interface User extends AuthIdentity {
      id: string;
      name: string;
      role: Role;
    }
  }
}
