import { Role } from 'src/generated/prisma/enums';

export interface AuthIdentity {
  id: string;
  name: string;
  role: Role;
}
