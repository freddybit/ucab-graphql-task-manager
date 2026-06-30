import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Query(() => [Task], { name: 'tasks' })
  findAll() {
    return this.tasksService.findAllTasks();
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findTaskById(id);
  }

  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.tasksService.createTask(createTaskInput);
  }

  @Mutation(() => Task)
  updateTask(@Args('id', { type: () => Int }) id: number, @Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.updateTask(id, updateTaskInput);
  }

  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.removeTaskById(id);
  }

  @ResolveField(() => User)
  user(@Parent() task: Task) {
    return this.usersService.findUserById(task.idUser);
  }

  @ResolveField(() => Project)
  project(@Parent() task: Task) {
    return this.projectsService.findProjectById(task.idProject);
  }
}
