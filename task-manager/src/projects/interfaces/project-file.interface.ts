import { Project } from '../entities/project.entity';

export interface ProjectFile {
  lastId: number;
  projects: Project[];
}
