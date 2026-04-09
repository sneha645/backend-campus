import { Injectable } from '@nestjs/common';
import { UploadProjectDto } from 'src/common/uploadProject.dto';
import { Repository } from 'typeorm';
import { UploadProject } from '../entities/uploadProject';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(UploadProject)
    private readonly uploadRepo: Repository<UploadProject>,
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
