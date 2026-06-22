import { Role } from "../enums/user";

export interface JwtPayload {
  sub: string;
  name: string;
  role: Role;
}
