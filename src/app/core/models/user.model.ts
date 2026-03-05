import { UserRole } from "../enums/user-role.enum";

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  username: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: UserRole; 
}