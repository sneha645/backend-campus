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
import { Project, ProjectStatus } from 'src/entities/project.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { UploadInternshipDto } from 'src/dtos/internship.dto';
import { Internship } from 'src/entities/internship.entity';
import { Job } from 'src/entities/job.entity';
import { Application } from 'src/entities/application.entity';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentSubmission } from 'src/entities/assignment_submission.entity';
import { MailService } from 'src/mail/mail.service';

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

    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,

    @InjectRepository(AssignmentSubmission)
    private readonly submissionRepo: Repository<AssignmentSubmission>,

    private readonly mailService: MailService,
  ) {}

  async uploadProject(
    uploadProjectDto: UploadProjectDto,
    projectImage: Express.Multer.File,
    studentId: string,
  ): Promise<any> {
    try {
      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });
      console.log('student', student);
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: uploadProjectDto.mentorId, role: UserRole.MENTOR },
      });
      console.log('mentor', mentor);
      if (!mentor) {
        throw new NotFoundException('Mentor not found');
      }

      const project = this.projectRepo.create({
        ...uploadProjectDto,
        student,
        mentor,
        status: ProjectStatus.PENDING,
        imageUrl: projectImage
          ? `/uploads/images/${projectImage.filename}`
          : undefined,
        feedback: '',
      });
      console.log('project', project);

      const response = await this.projectRepo.save(project);
      console.log('response', response);

      await this.mailService.sendProjectAssignedMail(
        mentor.email,
        mentor.name,
        project.title,
      );

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
      const student = await this.userRepo.findOne({
        where: { user_id: studentId },
      });
      console.log('student', student);

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const mentor = await this.userRepo.findOne({
        where: { user_id: uploadInternshipDto.mentorId, role: UserRole.MENTOR },
      });
      console.log('mentor', mentor);

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
      console.log('internship', internship);

      const response = await this.internshipRepo.save(internship);
      console.log('response', response);

      await this.mailService.sendInternshipAssignedMail(
        mentor.email,
        mentor.name,
        internship.title,
      );

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

  async getProjectFeedbacks(studentId: string): Promise<any> {
    try {
      const projects = await this.projectRepo.find({
        where: { student: { user_id: studentId } },
      });

      const projectsWithFeedback = projects.filter(
        (project) => project.feedback && project.feedback.trim() !== '',
      );

      return projectsWithFeedback;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

  async getInternshipFeedbacks(studentId: string): Promise<any> {
    try {
      const internships = await this.internshipRepo.find({
        where: { student: { user_id: studentId } },
      });

      const internshipsWithFeedback = internships.filter(
        (internship) =>
          internship.feedback && internship.feedback.trim() !== '',
      );

      return internshipsWithFeedback;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get projects');
    }
  }

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

    if (apply) {
      throw new BadRequestException('Already applied');
    }

    const application = this.applicationRepo.create({
      job,
      resumeUrl: resumne ? `/uploads/documents/${resumne.filename}` : undefined,
      student: { user_id: userId },
    });

    return this.applicationRepo.save(application);
  }

  async getAppliedJobs(userId: string): Promise<any> {
    try {
      const applications = await this.applicationRepo.find({
        where: { student: { user_id: userId }, status: 'applied' },
        relations: ['job'],
      });
      return applications;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get applied jobs');
    }
  }

  async getAllAssignments(userId: string): Promise<any> {
    try {
      const user = await this.userRepo.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const assignments = await this.assignmentRepo.find({
        where: { assignment_assignto: user.year },
        relations: ['mentor'],
      });
      return assignments;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get assignments');
    }
  }

  async submitAssignment(
    file: Express.Multer.File,
    userId: string,
    assignmentId: string,
    mentorId: string,
  ): Promise<any> {
    try {
      const user = await this.userRepo.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const assignment = await this.assignmentRepo.findOne({
        where: {
          assignment_id: assignmentId,
          mentor: { user_id: mentorId },
        },
        relations: ['mentor'],
      });

      if (!assignment) {
        throw new NotFoundException('Assignment not found for this mentor');
      }

      if (assignment.assignment_assignto !== user.year) {
        throw new BadRequestException(
          'You are not assigned to this assignment',
        );
      }

      const existingSubmission = await this.submissionRepo.findOne({
        where: {
          assignment: { assignment_id: assignmentId },
          student: { user_id: userId },
          mentor: { user_id: mentorId },
        },
      });

      if (existingSubmission) {
        throw new BadRequestException('Already submitted to this mentor');
      }

      const submission = this.submissionRepo.create({
        fileUrl: file ? `/uploads/documents/${file.filename}` : undefined,
        student: { user_id: userId },
        assignment: { assignment_id: assignmentId },
        mentor: { user_id: mentorId },
      });

      return await this.submissionRepo.save(submission);
    } catch (error) {
      throw error;
    }
  }

  async getAllMentors(): Promise<any> {
    try {
      console.log('working');
      const mentors = await this.userRepo.find({
        where: { role: UserRole.MENTOR },
      });
      console.log('mentors', mentors);
      return mentors;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get mentors');
    }
  }

  async findStudentByYear(year: string): Promise<any> {
    try {
      const students = await this.userRepo.find({
        where: { role: UserRole.STUDENT, year },
      });
      return students;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get students');
    }
  }
}
