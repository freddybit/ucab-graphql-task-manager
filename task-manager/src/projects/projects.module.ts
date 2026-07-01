import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsRepository } from './projects.repository';

@Module({
  providers: [ProjectsResolver, ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
