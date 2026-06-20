import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

/**
 * @description Resolver class for handling GraphQL queries and mutations related to projects, utilizing the ProjectsService for business logic.
 */

@Resolver(() => Project)
export class ProjectsResolver {

  constructor(private readonly projectsService: ProjectsService) {}

  // Los query sirven para consultar datos

  @Query(() => [Project], { name: 'projects' })
  findAllProjects() {
    return this.projectsService.findAllProjects();
  }

  @Query(() => Project, { name: 'project' })
  findProjectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.findProjectById(id);
  }

  // Los mutation sirven para modificar datos

  @Mutation(() => Project)
  createProject(@Args('createProjectInput') input: CreateProjectInput) {
    return this.projectsService.createProject(input);
  }

  @Mutation(() => Project)
  updateProject(@Args('updateProjectInput') input: UpdateProjectInput) {
    return this.projectsService.updateProject(input);
  }

  @Mutation(() => Project)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.removeProjectById(id);
  }
}
