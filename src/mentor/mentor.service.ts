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
  ) { }

  async getAllProjects(userId: string) {
    return this.projectRepo.find({
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
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.status = ProjectStatus.APPROVED;
    project.feedback = dto.feedback;
    this.mailService.sendProjectApprovalEmail(project.student.email, project.title);
    return this.projectRepo.save(project);
  }

  async rejectProject(
    id: string,
    dto: { status: 'rejected'; feedback: string },
  ) {
    const project = await this.projectRepo.findOne({
      where: { project_id: id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.status = ProjectStatus.REJECTED;
    project.feedback = dto.feedback;
    this.mailService.sendProjectRejectionEmail(project.student.email, project.title, dto.feedback);
    return this.projectRepo.save(project);
  }

  async getAllInternships(userId: string) {
    return this.internshipRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async approveInternship(
    id: string,
    dto: { status: 'approved'; feedback: string },
  ) {
    const internship = await this.internshipRepo.findOne({
      where: { internship_id: id },
    });
    if (!internship) {
      throw new NotFoundException('Internship not found');
    }

    internship.status = InternshipStatus.APPROVED;
    internship.feedback = dto.feedback;
    this.mailService.sendInternshipApprovalEmail(internship.student.email, internship.title);
    return this.internshipRepo.save(internship);
  }

  async rejectInternship(
    id: string,
    dto: { status: 'rejected'; feedback: string },
  ) {
    const internship = await this.internshipRepo.findOne({
      where: { internship_id: id },
    });
    if (!internship) {
      throw new NotFoundException('Internship not found');
    }

    if (dto.status === 'rejected') {
      internship.status = InternshipStatus.REJECTED;
    }
    internship.feedback = dto.feedback;
    this.mailService.sendInternshipRejectionEmail(internship.student.email, internship.title, dto.feedback);
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
    const assignment = this.assignmentRepo.create(assignmentDto);

    const students = await this.studentService.findStudentByYear(assignmentDto.assignment_assignto);
    if (!students) {
      throw new NotFoundException('Students not found');
    }

    const emails = students.map((student: any) => student.email);
    this.mailService.sendNewAssignmentEmail(emails, assignment.assignment_title);

    return this.assignmentRepo.save({
      ...assignment,
      mentor: { user_id: userId },
    });
  }

  async getAllAssignments(userId: string) {
    return this.assignmentRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['mentor'],
    });
  }

  async getSubmittedAssignments(id: string) {
    return this.submissionRepo.find({
      where: { assignment: { assignment_id: id } },
      relations: ['student', 'assignment'],
    });
  }

  async approveSubmittedAssignment(id: string) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: id },
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = 'approved';
    this.mailService.sendAssignmentApprovalEmail(submission.student.email, submission.assignment.assignment_title);
    return this.submissionRepo.save(submission);
  }

  async rejectSubmittedAssignment(id: string) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: id },
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.status = 'rejected';
    this.mailService.sendAssignmentRejectionEmail(submission.student.email, submission.assignment.assignment_title, submission.feedback);
    return this.submissionRepo.save(submission);
  }

  async getAssignedProjects(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }
}
