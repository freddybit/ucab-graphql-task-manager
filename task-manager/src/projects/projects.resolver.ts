import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  // Los query sirven para consultar datos

  /**
   * @description Consulta GraphQL para obtener el listado completo de todos los proyectos registrados.
   * @returns {Project[]} Un arreglo con todos los objetos de tipo Project disponibles.
   */
  @Query(() => [Project], { name: 'projects' })
  findAllProjects() {
    return this.projectsService.findAllProjects();
  }

  /**
   * @description Consulta GraphQL para obtener un proyecto específico mediante su ID.
   * @param {number} id - El ID del proyecto que se desea consultar.
   * @returns {Project} El objeto de tipo Project correspondiente al ID proporcionado.
   */
  @Query(() => Project, { name: 'project' })
  findProjectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.findProjectById(id);
  }

  // Los mutation sirven para modificar datos

  /**
   * @description Mutación GraphQL para crear un nuevo proyecto con los datos proporcionados.
   * @param {CreateProjectInput} input - Los datos necesarios para crear el proyecto.
   * @returns {Project} El objeto de tipo Project recién creado.
   */
  @Mutation(() => Project)
  createProject(@Args('createProjectInput') input: CreateProjectInput) {
    return this.projectsService.createProject(input);
  }

  /**
   * @description Mutación GraphQL para actualizar un proyecto existente.
   * @param {number} id - El ID del proyecto a actualizar.
   * @param {UpdateProjectInput} input - Los datos para actualizar el proyecto.
   * @returns {Project} El objeto de tipo Project actualizado.
   */
  @Mutation(() => Project)
  updateProject(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProjectInput') input: UpdateProjectInput,
  ) {
    return this.projectsService.updateProject(id, input);
  }

  /**
   * @description Mutación GraphQL para eliminar un proyecto por su ID.
   * @param {number} id - El ID del proyecto a eliminar.
   * @returns {boolean} true si el proyecto fue eliminado, false en caso contrario.
   */
  @Mutation(() => Boolean)
  removeProject(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.removeProjectById(id);
  }
}
