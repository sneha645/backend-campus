import {
  BadRequestException,
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
import { Job } from 'src/entities/job.entity';
import { Application } from 'src/entities/application.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  // upload project
  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    projectImage: Express.Multer.File,
    studentId: string,
  ): Promise<any> {
    try {
      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: uploadProjectDto.mentorId, role: 'mentor' },
      });
      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }

      const project = this.projectRepo.create({
        ...uploadProjectDto,
        student: student,
        mentor: mentor,
        imageUrl: projectImage
          ? `/uploads/images/${projectImage.filename}`
          : undefined,
      });

      const response = await this.projectRepo.save(project);

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

  // upload internship
  async uploadInternship(
    uploadInternshipDto: UploadInternshipDto,
    certificateImage: Express.Multer.File,
    studentId: string,
  ): Promise<any> {
    try {
      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: uploadInternshipDto.mentorId, role: 'mentor' },
      });

      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }

      const internship = this.internshipRepo.create({
        ...uploadInternshipDto,
        student: student,
        mentor: mentor,
        certificateUrl: certificateImage
          ? `/uploads/images/${certificateImage.filename}`
          : undefined,
      });

      const response = await this.internshipRepo.save(internship);

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
      const projects = await this.projectRepo.find({
        where: { student: { user_id: studentId } },
      });
      return projects;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getMyInternships(studentId: string): Promise<any> {
    try {
      const internships = await this.internshipRepo.find({
        where: { student: { user_id: studentId } },
      });
      return internships;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get internships');
    }
  }

  // async getProfile(studentId: string): Promise<any> {
  //   try {
  //     const student = await this.userRepo.findOne({
  //       where: { user_id: studentId },
  //     });
  //     return student;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get profile');
  //   }
  // }

  // async updateProfile(
  //   updateStudentProfileDto: UpdateStudentProfileDto,
  //   studentId: string,
  // ): Promise<any> {
  //   try {
  //     const student = await this.userRepo.findOne({
  //       where: { user_id: studentId },
  //     });

  //     if (!student) {
  //       throw new NotFoundException('Student not found');
  //     }

  //     student.name = updateStudentProfileDto.name;
  //     student.year = updateStudentProfileDto.year;
  //     student.branch = updateStudentProfileDto.branch;

  //     const response = await this.userRepo.save(student);
  //     return {
  //       message: 'Profile updated successfully',
  //       student: response,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to update profile');
  //   }
  // }

  //job features
  async getJobs(): Promise<any> {
    try {
      const jobs = await this.jobRepo.find();
      return jobs;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get jobs');
    }
  }

  async applyJob(jobId: string, resumne: Express.Multer.File, userId: string) {
    const user = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const job = await this.jobRepo.findOne({ where: { job_id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    const apply = await this.applicationRepo.findOne({
      where: { job: { job_id: jobId }, student: { user_id: userId } },
    });

    if (!apply) {
      throw new BadRequestException('Already applied');
    }

    const application = this.applicationRepo.create({
      job,
      student: { user_id: userId },
    });

    return this.applicationRepo.save(application);
  }

  // async getAllAssignments(collageYear: string): Promise<any> {
  //   try {
  //     const assignments = await this.assignmentRepo.find({
  //       where: { student: { year: collageYear } },
  //     });
  //     return assignments;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get assignments');
  //   }
  // }

  // async submitAssignment(
  //   file: Express.Multer.File,
  //   studentId: string,
  // ): Promise<any> {
  //   try {
  //     const assignment = this.assignmentRepo.create({
  //       file: file ? `/uploads/images/${file.filename}` : undefined,
  //       student: { user_id: studentId },
  //     });

  //     assignment.status = 'submitted';
  //     assignment.submitted_at = new Date().toISOString();
  //     const response = await this.assignmentRepo.save(assignment);
  //     return {
  //       message: 'Assignment submitted successfully',
  //       assignment: response,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to submit assignment');
  //   }
  // }

  // async getAllStudents(): Promise<any> {
  //   try {
  //     console.log('working');
  //     const students = await this.userRepo.find({
  //       where: { role: 'student' },
  //     });
  //     console.log('students', students);
  //     return students;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get students');
  //   }
  // }

  // async getMyApplications(studentId: string): Promise<any> {
  //   try {
  //     console.log('working');
  //     const applications = await this.applicationRepo.find({
  //       where: { student: { user_id: studentId } },
  //     });
  //     console.log('applications', applications);
  //     return applications;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get applications');
  //   }
  // }

  // async getAllJobs(): Promise<any> {
  //   try {
  //     console.log('working');
  //     const jobs = await this.jobRepo.find();
  //     console.log('jobs', jobs);
  //     return jobs;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get jobs');
  //   }
  // }
}
