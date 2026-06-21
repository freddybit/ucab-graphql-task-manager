import { Test, TestingModule } from '@nestjs/testing';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('TasksResolver', () => {
  let resolver: TasksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksResolver,
        // Creamos objetos vacíos (mocks) para engañar al test y que pase la inyección
        { provide: TasksService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: ProjectsService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<TasksResolver>(TasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
