import { CreateTaskInput } from '../dto/create-task.input';
import { UpdateTaskInput } from '../dto/update-task.input';
import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  existTaskById(id: number): boolean;
  createTask(input: CreateTaskInput): Task;
  getAllTasks(): Task[];
  getTaskById(id: number): Task | undefined;
  updateTask(id: number, input: UpdateTaskInput): Task | undefined;
  deleteTask(id: number): boolean;
}
