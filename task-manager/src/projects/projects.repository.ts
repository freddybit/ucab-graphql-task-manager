import { Injectable, NotFoundException } from "@nestjs/common";
import { IProjectsRepository } from "./interfaces/projects-repository.interface";
import { CreateProjectInput } from "./dto/create-project.input";
import { UpdateProjectInput } from "./dto/update-project.input";
import { Project } from "./entities/project.entity";
import * as fs from 'fs';
import * as path from 'path';
import { ProjectFile } from "./interfaces/project-file.interface";

@Injectable()
export class ProjectsRepository implements IProjectsRepository {

    private readonly filePath: string = path.join(process.cwd(), 'data', 'projects-data.json');

    constructor(){}

    /**
     * @description Lee y analiza el contenido del archivo JSON de persistencia.
     * @private
     * @returns {ProjectFile} El objeto estructurado con los datos de los proyectos.
     * @throws {Error} Si ocurre un error al leer o parsear el archivo.
     */
    private readFile(): ProjectFile {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileContent) as ProjectFile;
    }

    /**
     * @description Serializa y escribe los datos actualizados de los proyectos en el archivo JSON.
     * @private
     * @param {ProjectFile} data - La estructura completa de proyectos a persistir.
     * @returns {void}
     */
    private saveFile(data: ProjectFile): void {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2),'utf-8');
    }

    onModuleInit() {
        const directory = path.dirname(this.filePath);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        if (!fs.existsSync(this.filePath)) {
            const startStructure: ProjectFile = { lastId: 0, projects: [] };
            this.saveFile(startStructure);
        }
    }

    /**
     * @description Verifica si un proyecto existe por su nombre.
     * @param {string} projectName - El nombre del proyecto a buscar.
     * @returns {boolean} true si el proyecto existe, false en caso contrario.
     */
    existProjectByName(projectName: string): boolean {
        const json = this.readFile();
        return json.projects.some((pro) => pro.projectName === projectName);
    }

    /**
     * @description Verifica si un proyecto existe por su ID.
     * @param {number} id - El ID del proyecto a buscar.
     * @returns {boolean} true si el proyecto existe, false en caso contrario.
     */
    existProjectById(id: number): boolean {
        const json = this.readFile();
        return json.projects.some((pro) => pro.idProject === id);
    }

    /**
     * @description Crea un nuevo proyecto.
     * @param {CreateProjectInput} input - Los datos para crear el nuevo proyecto.
     * @returns {Project} El proyecto creado.
     */
    createProject(input: CreateProjectInput): Project {
        const json = this.readFile();

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

    /**
     * @description Obtiene todos los proyectos.
     * @returns {Project[]} Un array con todos los proyectos.
     */
    getAllProjects(): Project[] {
        const json = this.readFile();
        return json.projects;
    }

    /**
     * @description Obtiene un proyecto por su ID.
     * @param {number} id - El ID del proyecto a buscar.
     * @returns {Project | undefined} El proyecto encontrado o undefined si no existe.
     */
    getProjectById(id: number): Project | undefined {
        const json = this.readFile();
        const project = json.projects.find((pro) => pro.idProject === id);

        return project;
    }

    /**
     * @description Actualiza un proyecto existente.
     * @param {number} id - El ID del proyecto a actualizar.
     * @param {UpdateProjectInput} input - Los datos para actualizar el proyecto.
     * @returns {Project | undefined} El proyecto actualizado o undefined si no existe.
     */
    updateProject(id: number, input: UpdateProjectInput): Project | undefined {
        const json = this.readFile();
        const projectIndex = json.projects.findIndex((pro) => pro.idProject === id);

        if (projectIndex === -1)
            throw new NotFoundException(`AVISO: No se encontró un proyecto con el ID ${id}`);
        

        json.projects[projectIndex] = {
            ...json.projects[projectIndex], 
            ...input, 
            idProject: id,
        };

        this.saveFile(json);
        return json.projects[projectIndex];
    }

    /**
     * @description Elimina un proyecto por su ID.
     * @param {number} id - El ID del proyecto a eliminar.
     * @returns {boolean} true si el proyecto fue eliminado, false en caso contrario.
     */
    deleteProject(id: number): boolean {
        const json = this.readFile();
        const index = json.projects.findIndex((project) => project.idProject === id);

        if (index === -1) return false;

        json.projects.splice(index, 1);
        this.saveFile(json);

        return true;
    }


}