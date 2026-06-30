import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { TasksRepository } from './tasks.repository';

@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService, TasksRepository],
})
export class TasksModule {}
