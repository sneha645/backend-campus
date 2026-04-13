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
      console.log('working');
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
        imageUrl: image ? `/uploads/images/${image.filename}` : undefined,
      });

      const response = await this.projectRepo.save(project);
      console.log('response', response);

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
    certificateImage: Express.Multer.File,
    studentId: string,
  ): Promise<any> {
    try {
      console.log('working');
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
        certificateImage: certificateImage
          ? `/uploads/images/${certificateImage.filename}`
          : undefined,
      });

      const response = await this.internshipRepo.save(internship);
      console.log('response', response);

      return {
        message: 'Internship uploaded successfully',
        internship: response,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload project');
    }
  }

  async getMyProjects(studentId: string): Promise<any> {
    try {
      console.log('working');
      const projects = await this.projectRepo.find({
        where: { student: { user_id: studentId } },
      });
      console.log('projects', projects);
      return projects;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getMyInternships(studentId: string): Promise<any> {
    try {
      console.log('working');
      const internships = await this.internshipRepo.find({
        where: { student: { user_id: studentId } },
      });
      console.log('internships', internships);
      return internships;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get internships');
    }
  }

  async getAllStudents(): Promise<any> {
    try {
      console.log('working');
      const students = await this.userRepo.find({
        where: { role: 'student' },
      });
      console.log('students', students);
      return students;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get students');
    }
  }
}
