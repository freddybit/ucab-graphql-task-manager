import { Task } from "../entities/task.entity";

export interface TaskFile {
  lastId: number;
  tasks: Task[];
}