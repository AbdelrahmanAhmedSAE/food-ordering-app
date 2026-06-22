import { Role } from "../enums";

export interface ActiveUser {
  id: string;
  name: string;
  role: Role;
}
