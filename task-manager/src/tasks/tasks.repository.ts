import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ITaskRepository } from "./interfaces/task-repository.interface";
import * as fs from 'fs';
import * as path from 'path';
import { CreateTaskInput } from "./dto/create-task.input";
import { UpdateTaskInput } from "./dto/update-task.input";
import { Task } from "./entities/task.entity";
import { TaskFile } from "./interfaces/task-file.interface";
import { UsersService } from "../users/users.service";
import { ProjectsService } from "../projects/projects.service";


@Injectable()
export class TasksRepository implements ITaskRepository {

    private readonly userService: UsersService;
    private readonly projectService: ProjectsService;
    private readonly filePath: string = path.join(process.cwd(), 'data', 'task-data.json');

    private readFile(): TaskFile {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const json = JSON.parse(fileContent) as TaskFile;

        json.tasks = json.tasks.map((task) => ({ ...task, createdDate: new Date(task.createdDate) }));
        return json;
    }

    private saveFile(data: TaskFile): void {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    OnModuleInit() {
        const directory = path.dirname(this.filePath);
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
        if (!fs.existsSync(this.filePath)) {
            const startStructure: TaskFile = { lastId: 0, tasks: [] };
            this.saveFile(startStructure);
        }
    }

    constructor(userService: UsersService, projectService: ProjectsService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    existTaskById(id: number): boolean {
        const json = this.readFile();
        return json.tasks.some((task) => task.idTask === id);
    }

    createTask(input: CreateTaskInput): Task {
        const json = this.readFile();

        const newTask: Task = {
            idTask: json.lastId + 1,
            title: input.title,
            description: input.description,
            tags: input.tags,
            status: input.status,
            idUser: input.idUser,
            idProject: input.idProject,
            createdDate: new Date(),
        }

        json.tasks.push(newTask);
        json.lastId = newTask.idTask;
        this.saveFile(json);

        return newTask;
    }

    getAllTasks(): Task[] {
        const json = this.readFile();
        return json.tasks;
    }
    getTaskById(id: number): Task | undefined {
        const json = this.readFile();
        return json.tasks.find((task) => task.idTask === id);
    }

    updateTask(id: number, input: UpdateTaskInput): Task | undefined {
        const json = this.readFile();
        const taskIndex = json.tasks.findIndex((t) => t.idTask === input.idTask);

        if (taskIndex === -1) 
            throw new NotFoundException(`AVISO: No se encontró la tarea con ID ${input.idTask}`);

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

    deleteTask(id: number): boolean {
        const json = this.readFile();
        const index = json.tasks.findIndex((task) => task.idTask === id);
        if (index === -1) return false;

        json.tasks.splice(index, 1);
        this.saveFile(json);
        return true;
    }

}