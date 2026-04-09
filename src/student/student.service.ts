import { Injectable } from '@nestjs/common';
import { UploadProjectDto } from 'src/common/uploadProject.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/Project.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepo: Repository<Project>) {}

  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    studentId: string,
  ): Promise<any> {
    const project = this.studentRepo.create(uploadProjectDto);
    project.studentId = studentId;
    return this.studentRepo.save(project);
  }
}
