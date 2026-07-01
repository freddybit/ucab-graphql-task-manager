import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { ProjectFile } from './interfaces/project-file.interface';
import { ProjectsRepository } from './projects.repository';

/**
 * @author Freddy Fernández <fafernandez.24@est.ucab.edu.ve>
 * @description Service class for managing projects, including file operations for data persistence.
 */
@Injectable()
export class ProjectsService {

  private readonly projectRepository: ProjectsRepository;

  /**
   * @description Valida de forma interna si la longitud de una cadena de texto está dentro del límite permitido.
   * @private
   * @param {string} text - El texto que se va a evaluar.
   * @param {number} maxLenght - El número máximo de caracteres permitidos.
   * @returns {boolean} True si el texto cumple con el límite, de lo contrario false.
   */
  constructor(projectRepository: ProjectsRepository) {
    this.projectRepository = projectRepository;
  }

  /**
   * @description Valida de forma interna si la longitud de una cadena de texto está dentro del límite permitido.
   * @private
   * @param {string} text - El texto que se va a evaluar.
   * @param {number} maxLenght - El número máximo de caracteres permitidos.
   * @returns {boolean} True si el texto cumple con el límite, de lo contrario false.
   */
  private checkLengthOfString(text: string, maxLenght: number): boolean {
    return text.length <= maxLenght;
  }

  /**
   * @description Comprueba a través del repositorio si ya existe un proyecto registrado con un nombre específico.
   * @param {string} projectName - El nombre del proyecto a verificar.
   * @returns {boolean} True si el nombre ya está registrado, de lo contrario false.
   */
  existProjectByName(projectName: string): boolean {
    return this.projectRepository.existProjectByName(projectName);
  }

  /**
   * @description Comprueba a través del repositorio si ya existe un proyecto registrado con un ID específico.
   * @param {number} id - El ID del proyecto a verificar.
   * @returns {boolean} True si el ID ya está registrado, de lo contrario false.
   */
  existProjectById(id: number): boolean {
    return this.projectRepository.existProjectById(id);
  }

  /**
   * @description Crea un nuevo proyecto con los datos proporcionados.
   * @param {CreateProjectInput} input - Los datos del proyecto a crear.
   * @returns {Project} El proyecto creado.
   */
  createProject(input: CreateProjectInput): Project {

    if (this.existProjectByName(input.projectName)) {
      throw new BadRequestException('Ya existe un proyecto con ese nombre.');
    }

    if (!this.checkLengthOfString(input.projectName, 50)) {
      throw new BadRequestException('El nombre del proyecto no puede exceder los 50 caracteres.');
    }

    if (!this.checkLengthOfString(input.projectDescription, 200)) {
      throw new BadRequestException('La descripción del proyecto no puede exceder los 200 caracteres.');
    }

    return this.projectRepository.createProject(input);   
  }

  /**
   * @description Obtiene una lista con todos los proyectos registrados.
   * @returns {Project[]} Un array con todos los proyectos.
   */
  findAllProjects(): Project[] {
    return this.projectRepository.getAllProjects();
  }

  /**
   * @description Busca un proyecto por su ID.
   * @param {number} id - El ID del proyecto a buscar.
   * @returns {Project} El proyecto encontrado.
   */
  findProjectById(id: number): Project {
    const project = this.projectRepository.getProjectById(id);
    if (!project) 
      throw new NotFoundException('No se encontró un proyecto con el ID ' + id);

    return project;
  }

  /**
   * @description Actualiza un proyecto existente con los datos proporcionados.
   * @param {number} id - El ID del proyecto a actualizar.
   * @param {UpdateProjectInput} input - Los datos actualizados del proyecto.
   * @returns {Project} El proyecto actualizado.
   */
  updateProject(id: number, input: UpdateProjectInput): Project {

    if (input.projectName && !this.checkLengthOfString(input.projectName, 50)) {
      throw new BadRequestException('El nombre del proyecto no puede exceder los 50 caracteres.');
    }

    if (input.projectDescription && !this.checkLengthOfString(input.projectDescription, 200)) {
      throw new BadRequestException('La descripción del proyecto no puede exceder los 200 caracteres.');
    }

    const project = this.projectRepository.getProjectById(id);
    if (!project) {
      throw new NotFoundException('No se encontró un proyecto con el ID ' + id);
    }

    return this.projectRepository.updateProject(id, input)!;
  }

  /**
   * @description Elimina un proyecto por su ID.
   * @param {number} id - El ID del proyecto a eliminar.
   * @returns {boolean} True si el proyecto fue eliminado, de lo contrario false.
   */
  removeProjectById(id: number): boolean {

    if (!this.existProjectById(id))
      throw new NotFoundException('No se encontró un proyecto con el ID ' + id);

    return this.projectRepository.deleteProject(id);
  }
}
