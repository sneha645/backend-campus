import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship, InternshipStatus } from 'src/entities/internship.entity';
import { AssignmentDto } from 'src/dtos/assignment.dto';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentSubmission } from 'src/entities/assignment_submission.entity';
import { MailService } from 'src/mail/mail.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,

    @InjectRepository(AssignmentSubmission)
    private readonly submissionRepo: Repository<AssignmentSubmission>,
    private readonly mailService: MailService,

    private readonly studentService: StudentService,
  ) {}

  async getAllProjects(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async getAllInternships(userId: string) {
    return this.internshipRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async getAssignedProjects(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async getAssignedInternships(userId: string) {
    return this.internshipRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async approveProject(
    id: string,
    dto: { status: 'approved'; feedback: string },
  ) {
    console.log(dto);
    const project = await this.projectRepo.findOne({
      where: { project_id: id },
      relations: ['student', 'mentor'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.status = ProjectStatus.APPROVED;
    project.feedback = dto.feedback;

    this.mailService.sendProjectApprovalEmail(
      project.student.email,
      project.title,
    );
    return this.projectRepo.save(project);
  }

  async rejectProject(
    id: string,
    dto: { status: 'rejected'; feedback: string },
  ) {
    const project = await this.projectRepo.findOne({
      where: { project_id: id },
      relations: ['student', 'mentor'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.status = ProjectStatus.REJECTED;
    project.feedback = dto.feedback;
    this.mailService.sendProjectRejectionEmail(
      project.student.email,
      project.title,
      dto.feedback,
    );
    return this.projectRepo.save(project);
  }

  async approveInternship(
    id: string,
    dto: { status: 'approved'; feedback: string },
  ) {
    const internship = await this.internshipRepo.findOne({
      where: { internship_id: id },
      relations: ['student', 'mentor'],
    });
    if (!internship) {
      throw new NotFoundException('Internship not found');
    }

    internship.status = InternshipStatus.APPROVED;
    internship.feedback = dto.feedback;
    this.mailService.sendInternshipApprovalEmail(
      internship.student.email,
      internship.title,
    );
    return this.internshipRepo.save(internship);
  }

  async rejectInternship(
    id: string,
    dto: { status: 'rejected'; feedback: string },
  ) {
    const internship = await this.internshipRepo.findOne({
      where: { internship_id: id },
      relations: ['student', 'mentor'],
    });
    if (!internship) {
      throw new NotFoundException('Internship not found');
    }

    if (dto.status === 'rejected') {
      internship.status = InternshipStatus.REJECTED;
    }
    internship.feedback = dto.feedback;
    this.mailService.sendInternshipRejectionEmail(
      internship.student.email,
      internship.title,
      dto.feedback,
    );
    return this.internshipRepo.save(internship);
  }

  async getProjectById(id: string) {
    return this.projectRepo.findOne({ where: { project_id: id } });
  }

  async getInternshipById(id: string) {
    return this.internshipRepo.findOne({ where: { internship_id: id } });
  }

  async createAssignment(assignmentDto: AssignmentDto, userId: string) {
    const mentor = await this.userRepo.findOne({ where: { user_id: userId } });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    const assignment = this.assignmentRepo.create({
      ...assignmentDto,
      mentor: mentor,
    });

    return this.assignmentRepo.save(assignment);
  }

  async getAllAssignments(userId: string) {
    return this.assignmentRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['mentor'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getSubmittedAssignments(id: string) {
    return this.submissionRepo.find({
      where: { assignment: { assignment_id: id } },
      relations: ['student', 'assignment'],
    });
  }

  async approveSubmittedAssignment(
    id: string,
    dto: { status: 'approved'; score: number; feedback: string },
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: id },
      relations: ['student', 'assignment'],
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = 'approved';
    submission.score = dto.score;
    submission.feedback = dto.feedback;
    this.mailService.sendAssignmentApprovalEmail(
      submission.student.email,
      submission.assignment.assignment_title,
    );
    return this.submissionRepo.save(submission);
  }

  async rejectSubmittedAssignment(
    id: string,
    dto: { status: 'rejected'; score: number; feedback: string },
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: id },
      relations: ['student', 'assignment'],
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = 'rejected';
    submission.score = dto.score;
    submission.feedback = dto.feedback;
    this.mailService.sendAssignmentRejectionEmail(
      submission.student.email,
      submission.assignment.assignment_title,
      submission.feedback,
    );
    return this.submissionRepo.save(submission);
  }
}
