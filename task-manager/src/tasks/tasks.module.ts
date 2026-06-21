import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
