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
import { UploadInternshipDto } from 'src/dtos/internship.dto';
import { Internship } from 'src/entities/internship.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    image: Express.Multer.File,
    studentId: string,
  ): Promise<any> {
    try {
      console.log("working")
      const { mentorId, ...projectData } = uploadProjectDto;

      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: mentorId },
      });

      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }

      const project = this.projectRepo.create({
        ...projectData,
        student: student,
        mentor: mentor,
        imageUrl: image ? `uploads/${image.filename}` : undefined,
      });

      const response = await this.projectRepo.save(project);
      console.log("response", response)

      return {
        message: 'Project uploaded successfully',
        project: response,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload project');
    }
  }

  async uploadInternship(
    uploadInternshipDto: UploadInternshipDto,
    studentId: string,
  ): Promise<any> {
    try {
      const { mentorId, ...internshipData } = uploadInternshipDto;

      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: mentorId },
      });

      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }

      const internship = this.internshipRepo.create({
        ...internshipData,
        student: student,
        mentor: mentor,
      });

      const response = await this.internshipRepo.save(internship);

      return {
        message: 'Internship uploaded successfully',
        project: response,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload project');
    }
  }
}
