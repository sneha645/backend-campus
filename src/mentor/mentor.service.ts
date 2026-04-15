import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Internship } from 'src/entities/internship.entity';
import { AssignmentDto } from 'src/dtos/assignment.dto';
import { Assignment } from 'src/entities/assignment.entity';

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
      relations: ['student'],
    });
  }

  async approveProject(
    id: string,
    dto: { status: 'approved' | 'rejected'; feedback: string },
  ) {
    return this.internshipRepo.update(id, {
      status: dto.status,
      feedback: dto.feedback,
    });
  }

  async getAllInternships(userId: string) {
    return this.projectRepo.find({
      where: { mentor: { user_id: userId } },
      relations: ['student'],
    });
  }

  async approveInternship(
    id: string,
    dto: { status: 'approved' | 'rejected'; feedback: string },
  ) {
    return this.internshipRepo.update(id, {
      status: dto.status,
      feedback: dto.feedback,
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

  // async getAllAssignments(userId: string) {
  //   return this.assignmentRepo.find({
  //     where: { mentor: { user_id: userId } },
  //   });
  // }

  async getSubmittedAssignments() {
    return this.assignmentRepo.find({
      where: { status: 'submitted' },
    });
  }
}
