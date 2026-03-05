import { UserRole } from "../../../core/enums/user-role.enum";

export interface LoginResponse {
  token: string;
  role: UserRole;
  fullName: string;
}