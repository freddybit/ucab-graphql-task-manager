import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import * as fs from 'fs';
import * as path from 'path';
import { Project } from './entities/project.entity';
import { ProjectFile } from './interfaces/project-file.interface';

/**
 * @author Freddy Fernández <fafernandez.24@est.ucab.edu.ve>
 * @description Service class for managing projects, including file operations for data persistence.
 */
@Injectable()
export class ProjectsService implements OnModuleInit {

  private readonly projectsFilePath = path.resolve(
    process.cwd(),
    'src/data/projects-data.json',
  );

  private generateProjectId(): () => number {
    let count = 0;
    return function () {
      count++;
      return count;
    };
  }

  private checkLenghtOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

  private readFile(): ProjectFile {
    const fileContent = fs.readFileSync(this.projectsFilePath, 'utf-8');
    return JSON.parse(fileContent) as ProjectFile;
  }

  private saveFile(data: ProjectFile): void {
    fs.writeFileSync(
      this.projectsFilePath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  }

  onModuleInit() {
    const directory = path.dirname(this.projectsFilePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(this.projectsFilePath)) {
      const startStructure: ProjectFile = { lastId: 0, projects: [] };
      this.saveFile(startStructure);
    }
  }

  existProjectByName(projectName: string): boolean {
    const json = this.readFile();
    return json.projects.some((pro) => pro.projectName === projectName);
  }

  existProjectById(id: number): boolean {
    const json = this.readFile();
    return json.projects.some((pro) => pro.idProject === id);
  }


  createProject(input: CreateProjectInput): Project {
    const json = this.readFile();

    if (this.existProjectByName(input.projectName)) {
      throw new BadRequestException('Ya existe un proyecto con ese nombre.');
    }

    if (!this.checkLenghtOfString(input.projectName, 50)) {
      throw new BadRequestException('El nombre del proyecto no puede exceder los 50 caracteres.');
    }

    if (!this.checkLenghtOfString(input.projectDescription, 200)) {
      throw new BadRequestException('La descripción del proyecto no puede exceder los 200 caracteres.');
    }

    const newProject: Project = {
      idProject: json.lastId,
      projectName: input.projectName,
      projectDescription: input.projectDescription,
    };
    
    json.lastId++;
    json.projects.push(newProject);
    this.saveFile(json);

    return newProject;
  }

  findAllProjects(): Project[] {
    const json = this.readFile();
    return json.projects;
  }

  findProjectById(id: number): Project {
    const json = this.readFile();
    const project = json.projects.find((pro) => pro.idProject === id);
    if (!project) throw new NotFoundException('No se encontró un proyecto con el ID ' + id);
    return project;
  }

  updateProject(input: UpdateProjectInput): void {
    const json = this.readFile();
    const projectIndex = json.projects.findIndex((pro) => pro.idProject === input.idProject);

    if (projectIndex === -1) {
      throw new NotFoundException('No se encontró un proyecto con el ID ' + input.idProject);
    }

    if (input.projectName && !this.checkLenghtOfString(input.projectName, 50)) {
      throw new BadRequestException('El nombre del proyecto no puede exceder los 50 caracteres.');
    }

    if (input.projectDescription && !this.checkLenghtOfString(input.projectDescription, 200)) {
      throw new BadRequestException('La descripción del proyecto no puede exceder los 200 caracteres.');
    }

    json.projects[projectIndex] = {
      ...json.projects[projectIndex], 
      ...input, 
      idProject: json.projects[projectIndex].idProject,
    };

    this.saveFile(json);
  }

  removeProjectById(id: number): void {
    const json = this.readFile();

    if (!this.existProjectById(id)) {
      throw new NotFoundException('No se encontró un proyecto con el ID ' + id);
    }

    const projectIndex = json.projects.findIndex((pro) => pro.idProject === id);
    json.projects.splice(projectIndex);
    this.saveFile(json);
  }
}
