import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: UsersService, useValue: {} },
        { provide: ProjectsService, useValue: {} },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
