import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { TaskStatus } from './enums/task-status.enum';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  private readonly usersService: UsersService;
  private readonly projectsService: ProjectsService;
  private readonly tasksRepository: TasksRepository;

  constructor(
    usersService: UsersService,
    projectsService: ProjectsService,
    tasksRepository: TasksRepository,
  ) {
    this.usersService = usersService;
    this.projectsService = projectsService;
    this.tasksRepository = tasksRepository;
  }

  private checkLengthOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

  existTaskById(id: number): boolean {
    return this.tasksRepository.existTaskById(id);
  }

  createTask(input: CreateTaskInput): Task {
    if (!this.usersService.existUserById(input.idUser)) {
      throw new BadRequestException(
        'No se encontró un usuario con el ID: ' + input.idUser,
      );
    }

    if (!this.projectsService.existProjectById(input.idProject)) {
      throw new BadRequestException(
        'No se encontró un proyecto con el ID: ' + input.idProject,
      );
    }

    if (!this.checkLengthOfString(input.title, 150)) {
      throw new BadRequestException(
        'El nombre de la tarea no puede exceder los 150 caracteres.',
      );
    }

    if (!this.checkLengthOfString(input.description, 500)) {
      throw new BadRequestException(
        'La descripción de la tarea no puede exceder los 500 caracteres.',
      );
    }

    const newTask: Task = this.tasksRepository.createTask(input);
    return newTask;
  }

  findAllTasks(): Task[] {
    return this.tasksRepository.getAllTasks();
  }

  findTaskById(id: number): Task {
    if (!this.existTaskById(id))
      throw new NotFoundException('No se encontró una tarea con el ID ' + id);

    return this.tasksRepository.getTaskById(id)!;
  }

  updateTask(id: number, input: UpdateTaskInput): Task {
    if (
      input.idProject !== null &&
      !this.projectsService.existProjectById(input.idProject)
    )
      throw new NotFoundException(
        'No se encontró ningún proyecto con el ID: ' + input.idProject,
      );

    if (input.idUser !== null && !this.usersService.existUserById(input.idUser))
      throw new NotFoundException(
        'No se encontró ningún usuario con el ID: ' + input.idUser,
      );

    return this.tasksRepository.updateTask(id, input)!;
  }

  removeTaskById(id: number): boolean {
    if (!this.existTaskById(id)) {
      throw new NotFoundException('No se encontró una tarea con el ID: ' + id);
    }

    return this.tasksRepository.deleteTask(id);
  }
}
