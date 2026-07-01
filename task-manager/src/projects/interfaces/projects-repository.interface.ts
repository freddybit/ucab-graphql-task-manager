import { CreateProjectInput } from "../dto/create-project.input";
import { UpdateProjectInput } from "../dto/update-project.input";
import { Project } from "../entities/project.entity";

export interface IProjectsRepository {
    existProjectById(id: number): boolean;
    createProject(input: CreateProjectInput): Project;
    getAllProjects(): Project[];
    getProjectById(id: number): Project | undefined;
    updateProject(id: number, input: UpdateProjectInput): Project | undefined;
    deleteProject(id: number): boolean;
}
