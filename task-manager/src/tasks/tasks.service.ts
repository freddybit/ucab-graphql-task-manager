import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import * as fs from 'fs';
import * as path from 'path';
import { TaskFile } from './interfaces/task-file.interface';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  private readonly tasksFilePath = path.resolve(
    process.cwd(),
    '../data/task-data.json',
  );

  private readFile(): TaskFile {
    const fileContent = fs.readFileSync(this.tasksFilePath, 'utf-8');
    const json = JSON.parse(fileContent) as TaskFile;

    json.tasks = json.tasks.map((task) => ({
      ...task,
      createdDate: new Date(task.createdDate),
    }));

    return json;
  }

  private saveFile(data: TaskFile): void {
    fs.writeFileSync(
      this.tasksFilePath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  }

  private checkLengthOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

  onModuleInit() {
    const directory = path.dirname(this.tasksFilePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(this.tasksFilePath)) {
      const startStructure: TaskFile = { lastId: 0, tasks: [] };
      this.saveFile(startStructure);
    }
  }

  existTaskById(id: number): boolean {
    const json = this.readFile();
    return json.tasks.some((task) => task.idTask === id);
  }

  createTask(input: CreateTaskInput): Task {
    const json = this.readFile();

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

    const newTask: Task = {
      idTask: json.lastId,
      title: input.title,
      description: input.description ?? '',
      tags: input.tags ?? [],
      createdDate: new Date(),
      status: input.status,
      idUser: input.idUser,
      idProject: input.idProject,
    };

    json.lastId++;
    json.tasks.push(newTask);
    this.saveFile(json);

    return newTask;
  }

  findAllTasks(): Task[] {
    const json = this.readFile();
    return json.tasks;
  }

  findTaskById(id: number): Task {
    const json = this.readFile();
    const task = json.tasks.find((t) => t.idTask === id);
    if (!task)
      throw new NotFoundException('No se encontró una tarea con el ID ' + id);
    return task;
  }

  updateTask(input: UpdateTaskInput): Task {
    const json = this.readFile();
    const taskIndex = json.tasks.findIndex((t) => t.idTask === input.idTask);

    if (taskIndex === -1) {
      throw new NotFoundException(
        'No se encontró la tarea con el ID: ' + input.idTask,
      );
    }

    if (
      input.idProject !== null &&
      !this.projectsService.existProjectById(input.idProject)
    ) {
      throw new NotFoundException(
        'No se encontró ningún proyecto con el ID: ' + input.idProject,
      );
    }

    if (
      input.idUser !== null &&
      !this.usersService.existUserById(input.idUser)
    ) {
      throw new NotFoundException(
        'No se encontró ningún usuario con el ID: ' + input.idUser,
      );
    }

    const existingTask = json.tasks[taskIndex];

    json.tasks[taskIndex] = {
      ...existingTask,
      ...input,
      idTask: existingTask.idTask,
      createdDate: existingTask.createdDate,
    };

    this.saveFile(json);
    return json.tasks[taskIndex];
  }

  removeTaskById(id: number): Task {
    const json = this.readFile();

    if (!this.existTaskById(id)) {
      throw new NotFoundException('No se encontró una tarea con el ID: ' + id);
    }

    const taskIndex = json.tasks.findIndex((t) => t.idTask === id);
    const removedTask = json.tasks[taskIndex];
    json.tasks.splice(taskIndex, 1);
    this.saveFile(json);
    return removedTask;
  }
}
