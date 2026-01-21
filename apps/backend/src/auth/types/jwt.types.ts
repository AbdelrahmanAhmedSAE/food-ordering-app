import { Role } from 'src/generated/prisma/enums';

export interface JwtPayload {
  sub: string;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}
