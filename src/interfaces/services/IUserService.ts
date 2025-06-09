import { IUser } from '../../models/User';

export interface IUserService {
  createUser(
    name: string,
    surname: string,
    email: string,
    password: string,
  ): Promise<void>;
  authenticateUser(email: string, password: string): Promise<string>;
  getUser(id: string): Promise<IUser>;
  updateUser(id: string, updates: Partial<IUser>): Promise<IUser>;
  changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
