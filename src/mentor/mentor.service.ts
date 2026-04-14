import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship, InternshipStatus } from 'src/entities/internship.entity';
import { AssignmentDto } from 'src/dtos/assignment.dto';
import { Assignment } from 'src/entities/assignment.entity';
import { FeedbackDto } from 'src/dtos/feedback.dto';

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
  ) {}

  async getAllProjects(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
    });
  }

  async approveProject(id: string) {
    return this.projectRepo.update(id, { status: ProjectStatus.APPROVED });
  }

  async getAllInternships(userId: string) {
    return this.internshipRepo.find({
      where: { mentor: { user_id: userId } },
    });
  }

  async approveInternship(id: string) {
    return this.internshipRepo.update(id, {
      status: InternshipStatus.APPROVED,
    });
  }

  async getProjectById(id: string) {
    return this.projectRepo.findOne({ where: { project_id: id } });
  }

  async getInternshipById(id: string) {
    return this.internshipRepo.findOne({ where: { internship_id: id } });
  }

  async createAssignment(assignmentDto: AssignmentDto) {
    return this.assignmentRepo.save(assignmentDto);
  }

  async getAllAssignments(userId: string) {
    return this.assignmentRepo.find({
      where: { mentor: { user_id: userId } },
    });
  }

  async getSubmittedAssignments() {
    return this.assignmentRepo.find({
      where: { status: 'submitted' },
    });
  }

}
