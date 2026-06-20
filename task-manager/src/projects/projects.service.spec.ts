import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
