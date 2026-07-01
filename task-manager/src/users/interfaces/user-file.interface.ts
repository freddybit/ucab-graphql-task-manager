import { User } from '../entities/user.entity';

export interface UserFile {
  lastId: number;
  users: User[];
}
