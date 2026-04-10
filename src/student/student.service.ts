import { Injectable } from '@nestjs/common';
import { UploadProjectDto } from 'src/dtos/project.dto';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Project)
    private readonly uploadRepo: Repository<Project>,
  ) {}

  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    studentId: string,
  ): Promise<any> {
    const project = this.uploadRepo.create(uploadProjectDto);
    project.studentId = studentId;
    return this.uploadRepo.save(project);
  }
}
