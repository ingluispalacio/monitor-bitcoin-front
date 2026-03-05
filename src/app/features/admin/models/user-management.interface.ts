import { User } from "../../../core/models/user.model";

export interface UserManagementData {
  users: User[];
  totalPages: number;
  currentPage: number;
}