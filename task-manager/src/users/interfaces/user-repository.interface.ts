import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';

export interface IUsersRepository {
  existUserByEmail(email: string): boolean;
  existUserById(id: number): boolean;
  createUser(input: CreateUserInput): User;
  getAllUsers(): User[];
  getUserById(id: number): User | undefined;
  updateUser(id: number, input: UpdateUserInput): User | undefined;
  deleteUser(id: number): boolean;
}
