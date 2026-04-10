import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadProjectDto } from 'src/dtos/project.dto';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    studentId: string,
  ): Promise<any> {
    try {
      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const project = this.projectRepo.create({
        ...uploadProjectDto,
        student: student,
      });

      return await this.projectRepo.save(project);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload project');
    }
  }
}
