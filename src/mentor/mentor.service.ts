import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship, InternshipStatus } from 'src/entities/internship.entity';
import { AssignmentDto } from 'src/dtos/assignment.dto';
import { Assignment } from 'src/entities/assignment.entity';
import { AssignmentSubmission } from 'src/entities/assignment_submission.entity';

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
  ) {}

  async getAllProjects(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async approveProject(
    id: string,
    dto: { status: 'approved' | 'rejected'; feedback: string },
  ) {
    const project = await this.projectRepo.findOne({
      where: { project_id: id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (dto.status === 'approved') {
      project.status = ProjectStatus.APPROVED;
    } else {
      project.status = ProjectStatus.REJECTED;
    }
    project.feedback = dto.feedback;
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
    dto: { status: 'approved' | 'rejected'; feedback: string },
  ) {
    const internship = await this.internshipRepo.findOne({
      where: { internship_id: id },
    });
    if (!internship) {
      throw new NotFoundException('Internship not found');
    }

    if (dto.status === 'approved') {
      internship.status = InternshipStatus.APPROVED;
    } else {
      internship.status = InternshipStatus.REJECTED;
    }
    internship.feedback = dto.feedback;
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
    console.log(mentor);
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    const assignment = this.assignmentRepo.create(assignmentDto);
    return this.assignmentRepo.save({
      ...assignment,
      mentor: { user_id: userId },
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
    dto: { status: 'approved' | 'rejected'; feedback: string },
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { submission_id: id },
    });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (dto.status === 'approved') {
      submission.status = 'approved';
    } else {
      submission.status = 'rejected';
    }
    submission.feedback = dto.feedback;
    return this.submissionRepo.save(submission);
  }

  // async getAllAssignments(userId: string) {
  //   return this.assignmentRepo.find({
  //     where: { mentor: { user_id: userId } },
  //   });
  // }

  // async getSubmittedAssignments() {
  //   return this.assignmentRepo.find({
  //     where: { status: 'submitted' },
  //   });
  // }
}
